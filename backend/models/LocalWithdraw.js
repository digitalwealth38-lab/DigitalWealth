import mongoose from "mongoose";

const localWithdrawSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true }, // JazzCash / EasyPaisa / Bank
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("LocalWithdraw", localWithdrawSchema);
