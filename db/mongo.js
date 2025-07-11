import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost:27017/sth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error", err));

export default mongoose;