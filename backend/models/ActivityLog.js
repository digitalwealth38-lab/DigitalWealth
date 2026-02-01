import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  description: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ActivityLog", activityLogSchema);
