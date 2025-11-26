import ManualDeposit from "../models/ManualDeposit.js";
import User from "../models/user.model.js"
// Create Deposit Request (USER)
export const createDeposit = async (req, res) => {
  try {
    const { method, amount, screenshot } = req.body;

    if (!method || !amount || !screenshot) {
      return res.status(400).json({ message: "All fields required!" });
    }

    const deposit = await ManualDeposit.create({
      user: req.user._id,
      method,
      amount,
      screenshot,
    });

    res.status(201).json(deposit);
  } catch (err) {
    res.status(500).json({ message: "Failed to create deposit", error: err });
  }
};

// Fetch User Deposit History
export const getUserDeposits = async (req, res) => {
  try {
    const deposits = await ManualDeposit.find({ user: req.user._id })
      .select("-screenshot")          // REMOVE screenshot from response
      .sort({ createdAt: -1 });

    res.json({ deposits });
  } catch (err) {
    console.error("Deposit Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch history", error: err });
  }
};

// Admin - Fetch All Deposits
export const getAllDeposits = async (req, res) => {
  try {
    const deposits = await ManualDeposit.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposits", error: err });
  }
};

// Admin - Approve / Reject
export const updateDepositStatus = async (req, res) => {
  try {
    const {amount, status, adminNote, price_amount } = req.body;

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find deposit
    const deposit = await ManualDeposit.findById(req.params.id);
    if (!deposit) return res.status(404).json({ message: "Deposit not found" });

    // Update fields
    deposit.status = status;
    deposit.adminNote = adminNote || "";

    // If approved → set price amount
    if (status === "approved") {
      if (!price_amount || price_amount <= 0) {
        return res.status(400).json({ message: "price_amount (USD) is required" });
      }
      if(amount){
        deposit.amount=amount
      }
      deposit.price_amount = price_amount;

      // Add balance to user wallet
      const user = await User.findById(deposit.user);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.balance = (user.balance || 0) + Number(price_amount);

      await user.save();
    }

    await deposit.save();

    res.json({ message: `Deposit ${status} successfully`, deposit });

  } catch (err) {
    console.error("Deposit Update Error:", err);
    res.status(500).json({ message: "Failed to update deposit", error: err });
  }
};
