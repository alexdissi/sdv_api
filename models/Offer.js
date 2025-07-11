import mongoose from '../db/mongo.js';

const OfferSchema = new mongoose.Schema({
  from: String,
  to: String,
  departDate: Date,
  returnDate: Date,
  provider: String,
  price: Number,
  currency: String,
  legs: Array,
  hotel: Object,
  activity: Object,
});

OfferSchema.index({ from: 1, to: 1, price: 1 });
OfferSchema.index({ provider: 'text' });

export default mongoose.model('Offer', OfferSchema);