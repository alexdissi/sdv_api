import express from "express";
import Offer from "../models/Offer.js";
import redis from "../db/redis.js";
import zlib from "zlib";

const router = express.Router();

router.get("/top-destinations", async (req, res) => {
  const cacheKey = "stats:top-destinations";

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const buffer = Buffer.from(cached, "base64");
      const json = JSON.parse(zlib.gunzipSync(buffer));
      return res.json(json);
    }

    const results = await Offer.aggregate([
      { $group: { _id: "$to", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const gzipped = zlib.gzipSync(Buffer.from(JSON.stringify(results)));
    await redis.setEx(cacheKey, 300, gzipped.toString("base64"));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error computing stats" });
  }
});

export default router;
