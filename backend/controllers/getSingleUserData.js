import Transaction from "../models/Transaction.js";

export const getSingleUserData = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const { name, investedBalance, totalEarnings, balance ,teamSize,directReferrals,rank  } = req.user;
    res.json({ name, balance, totalEarnings, investedBalance,teamSize,directReferrals,rank });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deposithistory =async (req, res) => {
  try {
    const userId = req.user.id; // user id from auth middleware

    // Fetch transactions from DB
    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 }); // newest first
console.log(transactions)
    return res.status(200).json({
      success: true,
      transactions
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


