import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import redis from '../db/redis.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId } = req.body;
  const token = uuidv4();
  await redis.setEx(`session:${token}`, 900, userId);
  res.json({ token, expires_in: 900 });
});

export default router;