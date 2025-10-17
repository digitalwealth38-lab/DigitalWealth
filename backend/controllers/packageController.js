import User from "../models/user.model.js";
import Package from "../models/Package.js";
import TeamHierarchy from "../models/TeamHierarchy.js";

// 🛒 BUY PACKAGE CONTROLLER
export const buyPackage = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ From JWT
    const { packageId } = req.body;

    // 1️⃣ Find user & package
    const user = await User.findById(userId);
    const selectedPackage = await Package.findById(packageId);

    if (!user || !selectedPackage)
      return res.status(404).json({ message: "User or Package not found" });

    // 2️⃣ Check if user already has an active package
    if (user.hasActivePackage)
      return res
        .status(400)
        .json({ message: "You already have an active package" });

    // 3️⃣ Check balance
    if (user.balance < selectedPackage.price)
      return res
        .status(400)
        .json({ message: "Insufficient balance to buy this package" });

    // 4️⃣ Deduct amount & activate package
    user.balance -= selectedPackage.price;
    user.investedBalance += selectedPackage.price;
    user.currentPackage = selectedPackage._id;
    user.hasActivePackage = true;
    await user.save();

    // 5️⃣ TEAM HIERARCHY HANDLING
    let userTeam = await TeamHierarchy.findOne({ userId });
    if (!userTeam) {
      userTeam = new TeamHierarchy({ userId });
      await userTeam.save();
    }

    // 🟢 REFERRAL COMMISSIONS
    if (user.referredBy) {
      const referrer = await User.findOne({ referralCode: user.referredBy });

      if (referrer) {
        // 🟩 LEVEL 1 COMMISSION
        await addToTeam(referrer._id, user._id, 1);

        const level1Percent = (selectedPackage.commissions.level1 || 0) / 100;
        const level1Bonus = selectedPackage.price * level1Percent;
        referrer.balance += level1Bonus;
        referrer.totalEarnings +=level1Bonus
        referrer.directReferrals += 1;
        referrer.teamSize += 1;

        // 🟨 LEVEL UPGRADE LOGIC
        const directCount = referrer.directReferrals;
        const thresholds = { 10: 1, 20: 2, 40: 3, 80: 4, 160: 5 };
        const newLevel = thresholds[directCount];

if (newLevel && referrer.level < newLevel) {
  referrer.level = newLevel;

  const referrerPackage = await Package.findById(referrer.currentPackage);
  if (referrerPackage) {
    const rewardPercent = (referrerPackage.levelRewardPercent || 0) / 100;
    const rewardAmount = referrerPackage.price * rewardPercent;
    referrer.balance += rewardAmount;
     referrer.totalEarnings +=rewardAmount;

    // 🆕 Add to rewards history
    referrer.rewards.push({
      type: newLevel,
     amount: rewardAmount,
      date: new Date(),
    });
  }
}


        await referrer.save();

        // 🟦 LEVEL 2 COMMISSION
        if (referrer.referredBy) {
          const level2 = await User.findOne({ referralCode: referrer.referredBy });
          if (level2) {
            await addToTeam(level2._id, user._id, 2);

            const level2Percent = (selectedPackage.commissions.level2 || 0) / 100;
            const level2Bonus = selectedPackage.price * level2Percent;
            level2.balance += level2Bonus;
            level2.totalEarnings +=level1Bonus
            level2.teamSize += 1;
            await level2.save();

            // 🟧 LEVEL 3 COMMISSION
            if (level2.referredBy) {
              const level3 = await User.findOne({ referralCode: level2.referredBy });
              if (level3) {
                await addToTeam(level3._id, user._id, 3);

                const level3Percent = (selectedPackage.commissions.level3  || 0) / 100;
                const level3Bonus = selectedPackage.price * level3Percent;
                level3.balance += level3Bonus;
                level3.totalEarnings +=level1Bonus
                level3.teamSize += 1;
                await level3.save();
              }
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Package purchased successfully!",
      userBalance: user.balance,
      investedBalance: user.investedBalance,
    });
  } catch (error) {
    console.error("❌ Error buying package:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Helper function to manage team structure
const addToTeam = async (uplineId, newMemberId, level) => {
  let hierarchy = await TeamHierarchy.findOne({ userId: uplineId });

  if (!hierarchy) {
    hierarchy = new TeamHierarchy({ userId: uplineId });
  }

  if (level === 1 && !hierarchy.level1Members.includes(newMemberId)) {
    hierarchy.level1Members.push(newMemberId);
  } else if (level === 2 && !hierarchy.level2Members.includes(newMemberId)) {
    hierarchy.level2Members.push(newMemberId);
  } else if (level === 3 && !hierarchy.level3Members.includes(newMemberId)) {
    hierarchy.level3Members.push(newMemberId);
  }

  await hierarchy.save();
};
// 🟢 GET ALL PACKAGES
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json({ success: true, packages });
  } catch (error) {
    console.error("❌ Error fetching packages:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};