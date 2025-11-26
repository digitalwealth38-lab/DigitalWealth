import mongoose from "mongoose";

const manualDepositSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },

    method: { type: String, required: true }, // JazzCash, EasyPaisa, etc.

    amount: { type: Number, required: true }, // User amount in PKR

    price_amount: { type: Number}, // ADMIN SET PRICE (USD)

    screenshot: { type: String, required: true }, // Cloudinary URL

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ManualDeposit", manualDepositSchema);

