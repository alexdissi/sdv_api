import express from "express";

const router = express.Router();

let requestCount = 0;

router.use((req, res, next) => {
  requestCount++;
  next();
});

router.get("/metrics", (req, res) => {
  const metrics = `
# HELP sth_request_count Total HTTP requests
# TYPE sth_request_count counter
sth_request_count ${requestCount}
  `;
  res.set("Content-Type", "text/plain");
  res.send(metrics);
});

export default router;
