import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  commissions: {
    level1: { type: Number, required: true },
    level2: { type: Number, required: true },
    level3: { type: Number, required: true },
  },
  levelRewardPercent: { type: Number, required: true },
});

const Package = mongoose.model("Package", packageSchema);

export default Package;


