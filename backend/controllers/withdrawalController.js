import mongoose from "mongoose";
import Withdrawal from "../models/Withdrawal.js";
import User from "../models/user.model.js";

// 🟢 User makes a withdrawal request
export const createWithdrawal = async (req, res) => {
  try {
    const { amount, currency, walletAddress } = req.body;
    console.log(amount,currency,walletAddress)
    const userId = req.user.id;

    if (!amount || !currency || !walletAddress) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    user.balance = parseFloat((user.balance - amount).toFixed(2));
await user.save();


    const withdrawal = new Withdrawal({
      user: new mongoose.Types.ObjectId(userId),
      amount,
      currency,
      walletAddress,
      type: "withdrawal", 
      status: "pending",
    });

    await withdrawal.save();

    return res.json({
      success: true,
      msg: "Withdrawal request submitted successfully!",
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🟣 Get user's withdrawal history
export const getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user.id }).sort({ date: -1 });
    console.log(withdrawals)
    res.json({ success: true, transactions: withdrawals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔵 Admin gets all withdrawal requests
export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "name email _id") // ✅ Include name, email, and user ID
      .sort({ date: -1 });

    // 🧩 Optional check: handle empty result gracefully
    if (!withdrawals || withdrawals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No withdrawals found.",
        withdrawals: [],
      });
    }

    res.status(200).json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error) {
    console.error("❌ Error fetching withdrawals:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching withdrawals.",
      error: error.message,
    });
  }
};



// 🟢 Admin approves or rejects request
export const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote, txHash } = req.body; // ✅ Include txHash
    const withdrawal = await Withdrawal.findById(id);
    if (!withdrawal) {
      return res.status(404).json({ msg: "Withdrawal not found" });
    }

    // ✅ Update fields
    withdrawal.status = status;
    withdrawal.adminNote = adminNote || "";
    if (txHash) withdrawal.txHash = txHash; // Save hash only if provided

    await withdrawal.save();

    // 🪙 Refund if rejected
    if (status === "rejected") {
      const user = await User.findById(withdrawal.user);
      if (user) {
        user.balance = Math.round((user.balance + withdrawal.amount) * 100) / 100; // Keep 2 decimals
        await user.save();
      }
    }

    res.json({
      success: true,
      msg: `Withdrawal ${status} successfully.`,
      withdrawal,
    });
  } catch (error) {
    console.error("❌ Error updating withdrawal:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

