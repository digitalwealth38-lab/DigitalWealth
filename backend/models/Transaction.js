import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ["pending", "finished", "failed"], default: "pending" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
