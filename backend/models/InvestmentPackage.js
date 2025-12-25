import mongoose from "mongoose";

const InvestmentPackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tier: { type: String, enum: ["SILVER", "GOLD", "PREMIUM"] },

    investmentAmount: { type: Number, required: true },
    durationDays: { type: Number, required: true },

    // 🔥 Generic return
     pkgReturn: { type: Number, required: true },
    returnType: { type: String, enum: ["DAILY", "WEEKLY"], required: true },

    // 🔥 Calculated fields
  totalProfit: { type: Number, default: 0 },
  capital: { type: Number, default: 0 },
   totalReturn: { type: Number, default: 0 },


    // 🔥 PACKAGE AVAILABILITY EXPIRY
    packageExpiresAt: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("InvestmentPackage", InvestmentPackageSchema);
