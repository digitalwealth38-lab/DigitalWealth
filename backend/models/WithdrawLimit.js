import mongoose from "mongoose";

const withdrawLimitSchema = new mongoose.Schema(
  {
    minAmount: {
      type: Number,
      required: true,
      default: 500,
    },

    maxAmount: {
      type: Number,
      required: true,
      default: 50000,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WithdrawLimit", withdrawLimitSchema);
