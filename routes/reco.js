import express from "express";
import driver from "../db/neo4j.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { city } = req.query;
  const k = parseInt(req.query.k || "3", 10);

  if (!city || isNaN(k) || k < 1) {
    return res
      .status(400)
      .json({ error: "Missing or invalid parameters: city or k" });
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (c:City {code: $city})-[r:NEAR]->(n:City)
      RETURN n.code AS city, r.weight AS score
      ORDER BY r.weight DESC
      LIMIT ${k}
      `,
      { city }
    );

    const recommendations = result.records.map((record) => ({
      city: record.get("city"),
      score: record.get("score"),
    }));

    res.json(recommendations);
  } catch (error) {
    console.error("❌ Neo4j query error:", error);
    res.status(500).json({ error: "Internal server error (Neo4j)" });
  } finally {
    await session.close();
  }
});

export default router;
