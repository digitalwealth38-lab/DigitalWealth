export const getSingleUserData = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    const { name, investedBalance, totalEarnings, balance ,teamSize,directReferrals,rank  } = req.user;
    res.json({ name, balance, totalEarnings, investedBalance,teamSize,directReferrals,rank });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

