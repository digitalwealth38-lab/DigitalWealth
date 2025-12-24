import mongoose from "mongoose";

const AdminTradingSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, default: 0 }, // Current trading deposit
  },
  { timestamps: true }
);

export default mongoose.model("AdminTrading", AdminTradingSchema);
