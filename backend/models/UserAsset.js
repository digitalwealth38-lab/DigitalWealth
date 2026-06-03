import mongoose from "mongoose";

const userAssetSchema = new mongoose.Schema(
  {
    // User reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Asset reference
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    
    assetName: {
      type: String,
      required: true,
    },

    assetImage: {
      type: String,
      required: true,
    },
    // Quantity purchased
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Investment amount
    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Profit user will earn
    totalProfit: {
      type: Number,
      required: true,
      min: 0,
    },

    // Investment + Profit
    totalReturn: {
      type: Number,
      required: true,
      min: 0,
    },

    profitPerDay: {
      type: Number,
      required: true,
      min: 0,
    },
     capitalReturned: {
      type: Boolean,
      default: false,
    },

    // Asset duration in days
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // Days already claimed
    claimedDays: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total claimed amount
    claimedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Last claim date
    lastClaimDate: {
      type: Date,
      default: null,
    },

    // Purchase start date
    startDate: {
      type: Date,
      default: Date.now,
    },

    // Expiry date
    endDate: {
      type: Date,
      required: true,
    },

    // Asset status
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto deactivate when completed
userAssetSchema.pre("save", function (next) {
  if (this.claimedDays >= this.duration) {
    this.active = false;
  }
  next();
});
export default mongoose.model("UserAsset", userAssetSchema);