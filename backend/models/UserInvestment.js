import mongoose from "mongoose";

const UserInvestmentSchema = new mongoose.Schema(
  {
    // 🔹 USER
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🔹 PACKAGE REFERENCE (OPTIONAL)
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestmentPackage",
      default: null, // 🔥 SAFE if package is deleted
    },

    // 🔹 SNAPSHOT (IMMUTABLE DATA)
    packageName: {
      type: String,
      required: true,
    },

    investedAmount: {
      type: Number,
      required: true,
    },

    returnAmount: {
      type: Number, // daily or weekly return value
      required: true,
    },

    returnType: {
      type: String,
      enum: ["DAILY", "WEEKLY"],
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    // 🔹 ROI TRACKING
    totalProfit: {
      type: Number,
      default: 0,
    },

    totalReturn: {
      type: Number, // capital + profit
      required: true,
    },

    capital: {
      type: Number,
      required: true,
    },

    roiCredited: {
      type: Number,
      default: 0, // how much ROI already paid
    },

    // 🔹 TIMING
    startDate: {
      type: Date,
      default: Date.now,
    },

    lastROIAt: {
      type: Date,
      default: null,
    },

todayProfit: {
  type: Number,
  default: 0
},
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    // 🔹 STATUS
    capitalReturned: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED"],
      default: "ACTIVE",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserInvestment", UserInvestmentSchema);
