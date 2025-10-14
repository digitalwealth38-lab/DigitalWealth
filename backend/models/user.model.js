import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
emailVerifiedToken: String,
emailVerified: { type: Boolean, default: false },
 phone: String,
address: String,

    referralCode: { type: String, unique: true },
    referredBy: { type: String, default: null },

    balance: { type: Number, default: 0 },
    investedBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    teamSize: { type: Number, default: 0 },
    directReferrals: { type: Number, default: 0 },
    rewards: [RewardSchema],

    isAdmin: { type: Boolean, default: false },

    rank: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Diamond"],
      default: "Bronze",
    },
    level: { type: Number, default: 0 },
    profilePic: {
      type: String,},
    // ✅ Corrected field names for password reset
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
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

// 🔒 Hash password before saving (for login + reset)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;

