import User from "../models/user.model.js";
import Transaction from "../models/Transaction.js";
import withdrawal from "../models/Withdrawal.js";


export const getAdminStats = async (req, res) => {
  try {
    // 🧾 1. Total users
   const totalUsers = await User.countDocuments({ isAdmin: false });


    // 💰 2. Total deposits
    const totalDepositsAgg = await Transaction.aggregate([
      { $match: { type: "deposit", status: "finished" } },
      { $group: { _id: null, total: { $sum: "$price_amount" } } },
    ]);
    const totalDeposits = totalDepositsAgg[0]?.total || 0;

    // 💸 3. Total withdrawals
    const totalWithdrawalsAgg = await withdrawal.aggregate([
      { $match: { status: "finished" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalWithdrawals = totalWithdrawalsAgg[0]?.total || 0;

    // 📊 4. Total invested balance (check field name in Package model)
  const totalInvestedAgg = await User.aggregate([
  { $group: { _id: null, total: { $sum: "$investedBalance" } } },
]);
    const totalInvestedBalance = totalInvestedAgg[0]?.total || 0;

    // 🪙 5. Platform balance = deposits - withdrawals
    const platformBalance = totalDeposits - totalWithdrawals;

    // 🤑 6. Total earnings (from user model)
    const totalEarningsAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$totalEarnings" } } },
    ]);
    const totalEarnings = totalEarningsAgg[0]?.total || 0;

    console.log(
      totalUsers,
      totalDeposits,
      totalWithdrawals,
      totalInvestedBalance,
      platformBalance,
      totalEarnings
    );

    res.status(200).json({
      totalUsers,
      totalDeposits,
      totalWithdrawals,
      totalInvestedBalance,
      platformBalance,
      totalEarnings,
    });
  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


