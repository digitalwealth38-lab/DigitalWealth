import User from "../models/user.model.js";
import Package from "../models/Package.js";
import TeamHierarchy from "../models/TeamHierarchy.js";
import InvestmentPackage from "../models/InvestmentPackage.js";
import UserInvestment from "../models/UserInvestment.js";
import { logActivity } from "../lib/logActivity.js";

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
    user.balance = Number((user.balance - selectedPackage.price).toFixed(2));
    user.investedBalance += selectedPackage.price;
    user.currentPackage = selectedPackage._id;
    user.hasActivePackage = true;
    await user.save();
       await logActivity(
      user._id,
      "PACKAGE_PURCHASE",
      `Networking package purchased  package "${selectedPackage.name}" for $${selectedPackage.price}`
    );

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
        // 🔹 Check if referrer has an active package
        if (!referrer.hasActivePackage || !referrer.currentPackage) {
          // Option 2: Remove referral code from user automatically
          user.referredBy = null;
          await user.save();
          console.log(
            `Referrer with code ${referrer.referralCode} has no package. Referral code removed from user.`
          );
        } else {
          // 🟩 LEVEL 1 COMMISSION
          await addToTeam(referrer._id, user._id, 1);

          const referrerPackage = await Package.findById(referrer.currentPackage);
          const level1Percent = (referrerPackage.commissions.level1 || 0) / 100;
          const level1Bonus = selectedPackage.price * level1Percent;

          console.log("Level 1 bonus:", level1Bonus);

          referrer.balance += level1Bonus;
          referrer.totalEarnings += level1Bonus;
          referrer.directReferrals += 1;
          referrer.teamSize += 1;

          await referrer.save();

          // 🟨 LEVEL UPGRADE LOGIC
          const directCount = referrer.directReferrals;
          const levelUpRequirement = 10;
          const newLevel = Math.floor(directCount / levelUpRequirement);

          if (newLevel > referrer.level) {
            referrer.level = newLevel;

            const rewardPercent = (referrerPackage.levelRewardPercent || 0) / 100;
            const rewardAmount = referrerPackage.price * rewardPercent;

            referrer.balance += rewardAmount;
            referrer.totalEarnings += rewardAmount;

            referrer.rewards.push({
              type: `Level ${newLevel}`,
              amount: rewardAmount,
              date: new Date(),
            });

            await referrer.save();
          }

          // 🟦 LEVEL 2 & LEVEL 3 COMMISSION
          if (referrer.referredBy) {
            const level2 = await User.findOne({ referralCode: referrer.referredBy });
            if (level2) {
              await addToTeam(level2._id, user._id, 2);

              const level2Percent = (referrerPackage.commissions.level2 || 0) / 100;
              const level2Bonus = selectedPackage.price * level2Percent;
              console.log(level2Bonus);
              level2.balance += level2Bonus;
              level2.totalEarnings += level2Bonus;
              level2.teamSize += 1;
              await level2.save();

              if (level2.referredBy) {
                const level3 = await User.findOne({ referralCode: level2.referredBy });
                if (level3) {
                  await addToTeam(level3._id, user._id, 3);

                  const level3Percent = (referrerPackage.commissions.level3 || 0) / 100;
                  const level3Bonus = selectedPackage.price * level3Percent;
                  level3.balance += level3Bonus;
                  console.log(level3Bonus);
                  level3.totalEarnings += level3Bonus;
                  level3.teamSize += 1;
                  console.log(level3Bonus);
                  await level3.save();
                }
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
export const getinvestPackages = async (req, res) => {
  try {
    const pkgs = await InvestmentPackage.find({ isActive: true });
    res.status(200).json({
      success: true,
      packages: pkgs,
    });
  } catch (error) {
    console.error("❌ Error fetching investment packages:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching investment packages",
    });
  }
};

export const getMyInvestment = async (req, res) => {
  try {
    const investments = await UserInvestment.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const result = investments.map((inv) => {
      const dailyProfit = inv.todayProfit || 0; // ⚡ only today’s profit
      return {
        ...inv._doc,
        dailyProfit,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching investments:", error);
    res.status(500).json({ message: "Server error fetching investments" });
  }
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
// 🟢 Create a new investment package
export const createinvestPackage = async (req, res) => {
  try {
    const {
      name,
      investmentAmount,
      durationDays,
      returnType,
      pkgReturn,       // renamed
      packageExpiresAt,
      tier,
    } = req.body;

    let totalProfit = 0;
    if (returnType === "DAILY") totalProfit = durationDays * pkgReturn;
    else if (returnType === "WEEKLY") totalProfit = Math.floor(durationDays / 7) * pkgReturn;

    const capital = investmentAmount;
    const totalReturn = capital + totalProfit;

    const pkg = await InvestmentPackage.create({
      name,
      investmentAmount,
      durationDays,
      returnType,
      pkgReturn,       // renamed
      packageExpiresAt,
      tier,
      totalProfit,
      capital,
      totalReturn,
      isActive: true,
    });

    res.status(201).json({ success: true, message: "Package created successfully", package: pkg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const buyInvestpackage = async (req, res) => {
  try {
    const { packageId } = req.body;

    const user = await User.findById(req.user._id);
    const pkg = await InvestmentPackage.findById(packageId);

    if (!pkg || !pkg.isActive) {
      return res.status(400).json({ message: "Invalid or inactive package" });
    }

    if (user.balance < pkg.investmentAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 💰 Deduct wallet
    user.balance -= pkg.investmentAmount;
    user.investedBalance += pkg.investmentAmount;

    // ⏳ Expiry per investment
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pkg.durationDays);

    // 📈 Profit calculation
    let totalProfit = 0;

    if (pkg.returnType === "DAILY") {
      totalProfit = pkg.pkgReturn * pkg.durationDays;
    } else {
      const weeks = Math.floor(pkg.durationDays / 7);
      totalProfit = pkg.pkgReturn * weeks;
    }

    const totalReturn = pkg.investmentAmount + totalProfit;

    // 🧊 SNAPSHOT INVESTMENT (IMMUTABLE)
    const investment = await UserInvestment.create({
      userId: user._id,

      // reference only
      packageId: pkg._id,

      // snapshot fields
      packageName: pkg.name,
      investedAmount: pkg.investmentAmount,
      returnAmount: pkg.pkgReturn, 
      returnType: pkg.returnType,
      durationDays: pkg.durationDays,
      capital: pkg.investmentAmount,
      totalProfit,
      totalReturn,

      expiresAt,
      status: "ACTIVE",
    });

    await user.save();
        await logActivity(
      user._id,
      "INVESTMENT_PURCHASE",
      `Invested $${pkg.investmentAmount} in "${pkg.name}" investment package`
    );


    res.status(201).json({
      success: true,
      message: "Investment successful",
      investment,
    });
  } catch (error) {
    console.error("❌ Investment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🟢 Create a new package
export const createPackage = async (req, res) => {
  try {
    const { name, price, commissions, levelRewardPercent } = req.body;

    // Simple validation
    if (!name || !price || !commissions || !levelRewardPercent) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newPackage = new Package({
      name,
      price,
      commissions,
      levelRewardPercent,
    });

    await newPackage.save();

    res.status(201).json({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error("❌ Error creating package:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating package",
    });
  }
};

