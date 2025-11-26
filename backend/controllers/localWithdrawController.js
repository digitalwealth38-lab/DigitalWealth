import mongoose from "mongoose";
import LocalWithdraw from "../models/LocalWithdraw.js";
import User from "../models/user.model.js";

// 🟢 User creates a local withdrawal request
export const createLocalWithdraw = async (req, res) => {
  try {
    const { amount, method, accountName, accountNumber } = req.body;
    const userId = req.user.id;

    if (!amount || !method || !accountName || !accountNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct immediately (optional, or keep only on admin approve)
    user.balance = Math.round((user.balance - amount) * 100) / 100;
    await user.save();

    const withdraw = new LocalWithdraw({
      user: new mongoose.Types.ObjectId(userId),
      amount,
      method,
      accountName,
      accountNumber,
    });

    await withdraw.save();

    res.json({
      success: true,
      message: "Local withdrawal request submitted successfully! Admin will review it.",
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
