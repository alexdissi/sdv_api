import express from 'express';

import redis from '../db/redis.js';
import Offer from '../models/Offer.js';


const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();

    await redis.publish('offers:new', JSON.stringify({
      offerId: offer._id.toString(),
      from: offer.from,
      to: offer.to
    }));

    res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to insert offer' });
  }
});

export default router;