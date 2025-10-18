import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type: { 
  type: String, 
  enum: ["deposit", "withdrawal"], 
  required: true 
},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  price_amount:{type: Number},
  currency: { type: String, required: true },
  status: { type: String, enum: ["waiting","confirming","finished", "failed"], default: "waiting" },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);
