import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // MongoDB _id
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // MongoDB _id

  fromUserId: { type: String, required: true },   // Friendly userId
  fromUsername: { type: String, required: true }, // Friendly name
  toUserId: { type: String, required: true },     // Friendly userId
  toUsername: { type: String, required: true },   // Friendly name

  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Transfer", transferSchema);




