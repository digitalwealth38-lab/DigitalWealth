import Asset from "../models/Asset.js";
import User from "../models/user.model.js";
import UserAsset from "../models/UserAsset.js";
import Transaction from "../models/Assettransaction.js";
import { logActivity } from "../lib/logActivity.js";

export const buyAsset = async (req, res) => {
  try {
    const userId = req.user.id;

    const { assetId, quantity } = req.body;

    // 1️⃣ Validate Input
    if (!assetId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid asset or quantity",
      });
    }

    // 2️⃣ Find User & Asset
    const user = await User.findById(userId);

    const asset = await Asset.findById(assetId);

    if (!user || !asset) {
      return res.status(404).json({
        success: false,
        message: "User or Asset not found",
      });
    }

    // 3️⃣ Validate Min & Max Purchase
    if (quantity < asset.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase is ${asset.minPurchase}`,
      });
    }

    if (quantity > asset.maxPurchase) {
      return res.status(400).json({
        success: false,
        message: `Maximum purchase is ${asset.maxPurchase}`,
      });
    }

    // 4️⃣ Calculate Investment

    const investedAmount = quantity * asset.price;

    // 5️⃣ Check Balance
    if (user.balance < investedAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

  const totalProfit = quantity * asset.profitPerProduct;

// 5️⃣ capitalPerDay

// 6️⃣ profitPerDay
const profitPerDay = totalProfit / asset.duration;

const totalReturn = investedAmount + totalProfit;
    // 1️⃣1️⃣ Calculate End Date
    const endDate = new Date();

    endDate.setDate(
      endDate.getDate() + asset.duration
    );

    // 1️⃣2️⃣ Deduct User Balance
    user.balance -= investedAmount;
    user.investedBalance += investedAmount;
    

    await user.save();
  await logActivity(
  user._id,
  "ASSET_PURCHASE",
  `Purchased ${quantity} unit(s) of ${asset.name} for PKR ${investedAmount}`
);
 
    // 1️⃣3️⃣ Create User Asset
    const userAsset = await UserAsset.create({
      user: userId,

      asset: asset._id,
      assetName: asset.name,

      assetImage: asset.image,

      quantity,

      investedAmount,

      totalProfit,

      totalReturn,

      profitPerDay,

      duration: asset.duration,

      startDate: new Date(),

      endDate,
    });

    // 1️⃣4️⃣ Save Transaction
    await Transaction.create({
      user: userId,

      type: "asset_buy",

      amount: investedAmount,

      message: `Purchased ${quantity} ${asset.name}`,
    });

    // 1️⃣5️⃣ Response
    res.status(201).json({
      success: true,

      message: "Asset purchased successfully",

      userAsset,
    });

  } catch (error) {
    console.error("Buy Asset Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

export const getMyAssets = async (req, res) => {
  try {
    const investments = await UserAsset.find({
      user: req.user.id,
    }).populate("asset");

    res.json({
      success: true,
      investments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const claimAssetReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { investmentId } = req.body;

    const investment = await UserAsset.findById(investmentId);
    console.log("active:", investment.active);
console.log("capitalReturned:", investment.capitalReturned);
console.log("startDate:", investment.startDate);
console.log("duration:", investment.duration);
    if (!investment) {
      return res.status(404).json({ success: false, message: "Investment not found" });
    }

    if (investment.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    // ✅ Fetch user ONCE here — reuse everywhere below
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const today = new Date(); 
    const startDate = new Date(investment.startDate);
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const todayString = today.toDateString();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    if (daysPassed < 1) {
      return res.status(400).json({ success: false, message: "Reward starts from next day" });
    }

    if (daysPassed > investment.duration) {
      if (!investment.capitalReturned) {
        user.balance += investment.investedAmount;
        user.investedBalance = Math.max(0, user.investedBalance - investment.investedAmount);
        await user.save();
        investment.capitalReturned = true;
      }

      investment.active = false;
      await investment.save();

      return res.status(400).json({ success: false, message: "Investment expired and capital returned" });
    }

    // ✅ NOW check active (for manually deactivated investments)
    if (!investment.active) {
      return res.status(400).json({ success: false, message: "Investment expired" });
    }

    // ✅ Already claimed today check
    if (
      investment.lastClaimDate &&
      new Date(investment.lastClaimDate).toDateString() === todayString
    ) {
      return res.status(400).json({ success: false, message: "Already claimed today" });
    }

user.balance = Number((user.balance + investment.profitPerDay).toFixed(3));
user.totalEarnings = Number((user.totalEarnings + investment.profitPerDay).toFixed(3));

investment.claimedAmount = Number((investment.claimedAmount + investment.profitPerDay).toFixed(3));
investment.claimedDays += 1;
investment.lastClaimDate = today;

// ✅ If last day → also return capital
if (daysPassed === investment.duration) {
  user.balance = Number((user.balance + investment.investedAmount).toFixed(3));
  user.investedBalance = Math.max(0, user.investedBalance - investment.investedAmount);
  investment.capitalReturned = true;
  investment.active = false;
}

await user.save();
await investment.save();

    await Transaction.create({
      user: userId,
      type: "asset_claim",
      amount: investment.profitPerDay,
      message: "Daily asset reward claimed",
    });

    return res.status(200).json({
      success: true,
      message: "Reward claimed successfully",
      reward: investment.profitPerDay,
      claimedDays: investment.claimedDays,
      remainingDays: Math.max(investment.duration - daysPassed, 0),
      active: investment.active,
    });

  } catch (error) {
    console.log("Claim Asset Reward Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};