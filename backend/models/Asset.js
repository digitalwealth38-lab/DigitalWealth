import mongoose from "mongoose";
const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  image: String,

  price: {
    type: Number,
    required: true,
  },

  profitPerProduct: {
    type: Number,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  minPurchase: {
    type: Number,
    default: 1,
  },

  maxPurchase: {
    type: Number,
    default: 100,
  },

  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Asset", assetSchema);