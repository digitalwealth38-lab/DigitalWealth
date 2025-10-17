import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const RewardSchema = new mongoose.Schema({
  type: { type: String }, // e.g., "Referral Bonus", "Level Reward"
  amount: { type: Number },
  date: { type: Date, default: Date.now },
});

// 🔹 USER SCHEMA
const UserSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    profilePic: { type: String },

    // Email Verification
    emailVerifiedToken: String,
    emailVerified: { type: Boolean, default: false },

    // Referral System
    referralCode: { type: String, unique: true }, // Auto-generated
    referredBy: { type: String, default: null }, // Referral code of who referred this user

    // Financial Fields
    balance: { type: Number, default: 100 }, // Current wallet balance
    investedBalance: { type: Number, default: 0 }, // Total amount invested
    totalEarnings: { type: Number, default: 0 }, // Total income from referrals and rewards

    // Package / Investment Tracking
    currentPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null,
    },
    hasActivePackage: { type: Boolean, default: false },

    // Team Hierarchy Stats
    teamSize: { type: Number, default: 0 }, // Total team members up to level 3
    directReferrals: { type: Number, default: 0 }, // Only direct (level 1)

    // Rewards & Level System
    rewards: [RewardSchema],
    level: { type: Number, default: 0 }, // Starts at 0, updates to 1 when level 3 completes

    // Admin Access
    isAdmin: { type: Boolean, default: false },

    // Password Reset
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

//
// 🔹 Auto-generate referral code before saving
//
UserSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = `USR-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
  }
  next();
});

//
// 🔹 Hash password before saving (secure login + reset)
//
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//
// 🔹 Helper function for giving rewards (optional utility)
//
UserSchema.methods.addReward = async function (type, amount) {
  this.rewards.push({ type, amount });
  this.totalEarnings += amount;
  this.balance += amount;
  await this.save();
};

const User = mongoose.model("User", UserSchema);
export default User;


