import mongoose from "mongoose";

const InvestmentPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tier: { type: String, enum: ["SILVER", "GOLD", "PREMIUM"] },

    investmentAmount: { type: Number, required: true },
    durationDays: { type: Number, required: true },

    // 🔥 Generic return
    return: { type: Number, required: true },
    returnType: { type: String, enum: ["DAILY", "WEEKLY"], required: true },

    // 🔥 Calculated fields
    totalProfit: { type: Number, required: true },
    capital: { type: Number, required: true },
    totalReturn: { type: Number, required: true },

    // 🔥 PACKAGE AVAILABILITY EXPIRY
    packageExpiresAt: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("InvestmentPackage", InvestmentPackageSchema);
