import express from "express";
import morgan from "morgan";
import offersRoutes from "./routes/offers.js";
import insertOfferRoutes from "./routes/insertOffer.js";
import recoRoutes from "./routes/reco.js";
import statsRoutes from "./routes/stats.js";
import metricsRoutes from "./routes/metrics.js";
import "./db/mongo.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/offers", offersRoutes);
app.use("/insert-offer", insertOfferRoutes);
app.use("/reco", recoRoutes);
app.use("/stats", statsRoutes);
app.use("/", metricsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 STH API running on http://localhost:${PORT}`);
});
