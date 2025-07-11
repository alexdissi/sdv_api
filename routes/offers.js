import express from 'express';
import Offer from '../models/Offer.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { from, to, limit = 10, q } = req.query;

  try {

    const query = { from, to };
    if (q) {
      query.$text = { $search: q };
    }

    const offers = await Offer.find(query).sort({ price: 1 }).limit(Number(limit));
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching offers' });
  }
});

router.get('/:id', async (req, res) => {
  const offerId = req.params.id;

  try {

    const offer = await Offer.findById(offerId).lean();
    if (!offer) return res.status(404).json({ error: 'Offer not found' });

    const session = driver.session();
    const relatedIds = [];
    try {
      const result = await session.run(
        `MATCH (c1:City {code: $from})-[:NEAR]->(c2:City)
         RETURN c2.code AS city
         LIMIT 3`,
        { from: offer.from }
      );

      for (const record of result.records) {
        const cityCode = record.get('city');
        const others = await Offer.find({ from: offer.from, to: cityCode })
                                  .limit(1)
                                  .select('_id');
        if (others[0]) relatedIds.push(others[0]._id);
      }
    } finally {
      await session.close();
    }

    offer.relatedOffers = relatedIds;
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;