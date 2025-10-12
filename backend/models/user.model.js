import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
  type: String, // e.g., "Referral Bonus"
  amount: Number,
  date: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null },

    balance: { type: Number, default: 0 }, // 💰 Total account balance
    investedBalance: { type: Number, default: 0 }, // 💼 Amount currently invested
    totalEarnings: { type: Number, default: 0 }, // 💵 Total profit/bonus earned
    teamSize: { type: Number, default: 0 },
    directReferrals: { type: Number, default: 0 },
    rewards: [RewardSchema],

    isAdmin: { type: Boolean, default: false },

    // 🏆 Rank + numeric level
    rank: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Diamond"],
      default: "Bronze",
    },
    level: { type: Number, default: 0 }, // Bronze = 0, Silver = 1, Gold = 2, Diamond = 3
  },
  { timestamps: true }
);

// 🔹 Auto-generate referral code before saving
UserSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = `USR-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  }
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;

