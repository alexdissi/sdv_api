import express from "express";
import driver from "../db/neo4j.js";
import neo4j from "neo4j-driver";

const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;
  const k = neo4j.int(req.query.k || 3);
  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (c:City {code: $city})-[:NEAR]->(n:City)
       RETURN n.code AS city
       ORDER BY n.weight DESC
       LIMIT $k`,
      { city, k }
    );

    const cities = result.records.map((record) => record.get("city"));
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Neo4j error" });
  } finally {
    await session.close();
  }
});

export default router;
