import User from "../models/user.model.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";
import Package from "../models/Package.js";
import ManualDeposit from "../models/ManualDeposit.js";
import LocalWithdraw from "../models/LocalWithdraw.js";
import InvestmentPackage from "../models/InvestmentPackage.js";
import UserInvestment from "../models/UserInvestment.js";
import AdminTrading from "../models/AdminTrading.js";

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete related investments
    await UserInvestment.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked successfully" : "User unblocked successfully",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("BLOCK USER ERROR:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
};


export const Userinvestment=async (req, res) => {
  try {
    const { userId } = req.params;
console.log(userId)
    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch investments for this user
    const investments = await UserInvestment.find({ userId }).sort({ startDate: -1 });
    console.log(investments)

    res.status(200).json({
      message: "User investments fetched successfully",
      investments,
    });
  } catch (error) {
    console.error("Error fetching user investments:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateInvestPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      investmentAmount,
      durationDays,
      returnType,
       return: pkgReturn,
      packageExpiresAt,
    } = req.body;

    const pkg = await InvestmentPackage.findById(id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Investment package not found",
      });
    }

    // update fields
    pkg.name = name ?? pkg.name;
    pkg.investmentAmount = investmentAmount ?? pkg.investmentAmount;
    pkg.durationDays = durationDays ?? pkg.durationDays;
    pkg.returnType = returnType ?? pkg.returnType;
   pkg.return = pkgReturn ?? pkg.return;
    pkg.packageExpiresAt = packageExpiresAt ?? pkg.packageExpiresAt;

    await pkg.save();

    res.status(200).json({
      success: true,
      message: "Investment package updated successfully",
      package: pkg,
    });
  } catch (error) {
    console.error("❌ Update Invest Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update investment package",
    });
  }
};

/**
 * ✅ DELETE Investment Package
 * DELETE /admin/investpackage/:id
 */
export const deleteInvestPackage = async (req, res) => {
  try {
    const { id } = req.params;

    const pkg = await InvestmentPackage.findById(id);
    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Investment package not found",
      });
    }

    await pkg.deleteOne();

    res.status(200).json({
      success: true,
      message: "Investment package deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Invest Package Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete investment package",
    });
  }
};
export const getAdminStats = async (req, res) => {
  try {
    // 🧾 1. Total users
   const totalUsers = await User.countDocuments({ isAdmin: false });

    // 💰 2. Total deposits
    const totalDepositsAgg = await Transaction.aggregate([
      { $match: { type: "deposit", status: "finished" } },
      { $group: { _id: null, total: { $sum: "$price_amount" } } },
    ]);
    const manualDepAgg = await ManualDeposit.aggregate([
  { $match: { status: "approved" } },          // only count approved ones
  { $group: { _id: null, total: { $sum: "$price_amount" } } },
]);

const manualTotal = manualDepAgg[0]?.total || 0;

    const totalDeposits = totalDepositsAgg[0]?.total || 0;
const finalDeposits=totalDeposits+manualTotal


const activeInvestedAgg = await UserInvestment.aggregate([
  { $match: { status: "ACTIVE" } }, // only active investments
  { $group: { _id: null, total: { $sum: "$investedAmount" } } },
]);
const totalActiveInvested = activeInvestedAgg[0]?.total || 0;

    // 💸 3. Total withdrawals
const totalWithdrawalsAgg = await Withdrawal.aggregate([
  { $match: { status: "approved" } },
  { $group: { _id: null, total: { $sum: "$amount" } } },
]);
const totalManualAgg = await LocalWithdraw.aggregate([
  { $match: { status: "approved" } },
  { $group: { _id: null, total: { $sum: "$amount" } } },
]);
const totalManual = totalManualAgg[0]?.total || 0;

const totalWithdrawals = totalWithdrawalsAgg[0]?.total || 0;
console.log(totalWithdrawals);
const finalWithdrawal=totalWithdrawals+totalManual

    // 📊 4. Total invested balance (check field name in Package model)
  const totalInvestedAgg = await User.aggregate([
  { $group: { _id: null, total: { $sum: "$investedBalance" } } },
]);
    const totalInvestedBalance = totalInvestedAgg[0]?.total || 0;

      const adminTrading = await AdminTrading.findOne();
    const tradingDeposit = adminTrading?.amount || 0;
   // 🪙 5. Platform balance = sum of all user balances  
const platformBalanceAgg = await User.aggregate([
  { $group: { _id: null, total: { $sum: "$balance" } } },
]);
const platformBalance = platformBalanceAgg[0]?.total || 0;
// 💼 6. Admin profit = deposits - withdrawals - platformBalance  
const adminProfit = tradingDeposit + finalDeposits - finalWithdrawal - platformBalance -totalActiveInvested;

    console.log(
      totalUsers,
      finalDeposits,
      finalWithdrawal,
      totalInvestedBalance,
      totalActiveInvested,
      platformBalance,
      adminProfit,
      tradingDeposit
    );

    res.status(200).json({
      totalUsers,
      finalDeposits,
      finalWithdrawal,
      totalInvestedBalance,
      platformBalance,
      adminProfit,
      tradingDeposit
    });
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, investmentAmount, durationDays, returnType, return: returnAmount, packageExpiresAt } = req.body;

const updates = {
  name,
  investmentAmount,
  durationDays,
  returnType,
  ['return']: Number(returnAmount), // <-- bracket notation ensures 'return' is set
};

if (packageExpiresAt) updates.packageExpiresAt = new Date(packageExpiresAt);
 console.log("🚀 Updates object:", updates);

const updatedPackage = await InvestmentPackage.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({
      success: true,
      message: "✅ Package updated successfully!",
      package: updatedPackage,
    });
  } catch (error) {
    console.error("❌ Error updating package:", error);
    res.status(500).json({ message: "Failed to update package" });
  }
};


export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ message: "✅ Package deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting package:", error);
    res.status(500).json({ message: "Failed to delete package" });
  }
};

export const getAdminTrading = async (req, res) => {
  try {
    let trading = await AdminTrading.findOne();
    if (!trading) {
      trading = await AdminTrading.create({ amount: 0 });
    }
    res.status(200).json(trading);
  } catch (err) {
    console.error("Get Admin Trading Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin trading deposit (add or subtract)
export const updateAdminTrading = async (req, res) => {
  try {
    const { amount, action } = req.body; // action: "add" or "subtract"

    if (amount === undefined || !["add", "subtract"].includes(action)) {
      return res.status(400).json({ message: "Invalid request" });
    }

    let trading = await AdminTrading.findOne();
    if (!trading) {
      trading = await AdminTrading.create({ amount: 0 });
    }

    let updatedAmount = trading.amount;

    if (action === "add") {
      updatedAmount += parseFloat(amount);
    } else if (action === "subtract") {
      updatedAmount -= parseFloat(amount);
      if (updatedAmount < 0) updatedAmount = 0; // prevent negative
    }

    trading.amount = Math.round(updatedAmount * 100) / 100;
    await trading.save();

    res.status(200).json({
      success: true,
      message: `Admin trading deposit ${action}ed successfully`,
      trading,
    });
  } catch (err) {
    console.error("Update Admin Trading Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


