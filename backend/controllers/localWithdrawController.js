import mongoose from "mongoose";
import LocalWithdraw from "../models/LocalWithdraw.js";
import User from "../models/user.model.js";
import WithdrawLimit from "../models/WithdrawLimit.js";

// 🟢 User creates a local withdrawal request
export const createLocalWithdraw = async (req, res) => {
  try {
    const { amount, method, accountName, accountNumber } = req.body;
    const userId = req.user.id;

    // 1️⃣ Basic validation
    if (!amount || !method || !accountName || !accountNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid withdraw amount" });
    }

    // 2️⃣ Fetch withdraw limit
    const limit = await WithdrawLimit.findOne();

    if (!limit || !limit.isActive) {
      return res
        .status(400)
        .json({ message: "Withdraw is currently disabled" });
    }

    if (amount < limit.minAmount || amount > limit.maxAmount) {
      return res.status(400).json({
        message: `Withdraw amount must be between ${limit.minAmount + "$"} and ${limit.maxAmount + "$"}`,
      });
    }

    // 3️⃣ Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 ADDED: teamSize must be exactly 1
   if (user.teamSize !== 1 && user.canWithdraw !== true) {
  return res.status(403).json({
    message:
      "Withdraw is restricted. Add 1 active member or wait for admin approval.",
  });
}
    // 🔹 END ADDED LOGIC

    // 4️⃣ Balance check
    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 5️⃣ Deduct balance immediately
    user.balance = Math.round((user.balance - amount) * 100) / 100;
    await user.save();

    // 6️⃣ Create withdraw request
    const withdraw = await LocalWithdraw.create({
      user: new mongoose.Types.ObjectId(userId),
      amount,
      method,
      accountName,
      accountNumber,
    });

    res.status(201).json({
      success: true,
      message:
        "Local withdrawal request submitted successfully! Admin will review it.",
      withdraw,
    });
  } catch (err) {
    console.error("Local Withdrawal Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟣 User fetches their local withdrawal history
export const getUserLocalWithdrawals = async (req, res) => {
  try {
    const withdraws = await LocalWithdraw.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, transactions: withdraws });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔵 Admin fetches all local withdrawals
export const getAllLocalWithdrawals = async (req, res) => {
  try {
    const withdraws = await LocalWithdraw.find()
      .populate("user", "name email _id")
      .sort({ createdAt: -1 });

    if (!withdraws || withdraws.length === 0) {
      return res.status(200).json({ success: true, message: "No withdrawals found.", withdraws: [] });
    }

    res.status(200).json({ success: true, count: withdraws.length, withdraws });
  } catch (err) {
    console.error("Error fetching local withdrawals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Admin approves/rejects local withdrawal
export const updateLocalWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const withdraw = await LocalWithdraw.findById(id);
    if (!withdraw) return res.status(404).json({ msg: "Withdrawal not found" });

    withdraw.status = status;
    withdraw.adminNote = adminNote || "";

    // Refund user if rejected
    if (status === "rejected") {
      const user = await User.findById(withdraw.user);
      if (user) {
        user.balance = Math.round((user.balance + withdraw.amount) * 100) / 100;
        await user.save();
      }
    }

    await withdraw.save();

    res.json({ success: true, message: `Withdrawal ${status} successfully.`, withdraw });
  } catch (err) {
    console.error("Error updating local withdrawal:", err);
    res.status(500).json({ message: "Server error" });
  }
};
