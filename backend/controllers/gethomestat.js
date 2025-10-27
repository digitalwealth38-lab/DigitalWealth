import User from "../models/user.model.js";
export const gethomestat = async (req, res) => {
  try {
    console.log("🔥 gethomestat hit");

    const totalUsers = await User.countDocuments({ isAdmin: false });
    console.log("🧾 Total Users:", totalUsers);

    const totalInvestedAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$investedBalance" } } },
    ]);
    console.log("📊 Invested Aggregate:", totalInvestedAgg);

    const totalEarningsAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: "$totalEarnings" } } },
    ]);
    console.log("💰 Earnings Aggregate:", totalEarningsAgg);

    const totalInvestedBalance = totalInvestedAgg[0]?.total || 0;
    const totalEarnings = totalEarningsAgg[0]?.total || 0;

    res.status(200).json({
      totalUsers,
      totalInvestedBalance,
      totalEarnings,
    });
  } catch (error) {
    console.error("❌ Error fetching home stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
