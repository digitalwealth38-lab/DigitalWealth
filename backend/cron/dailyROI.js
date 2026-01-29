import cron from "node-cron";
import UserInvestment from "../models/UserInvestment.js";
import InvestmentPackage from "../models/InvestmentPackage.js";

import User from "../models/user.model.js";
// ✅ Production: runs every day at 12:00 AM Pakistan time
// ✅ Helper for comparison only
const roundForCompare = (num) => Number(num.toFixed(2));


cron.schedule("0 0 * * *", async () => {
  console.log("⏰ ROI cron running (production – 12:00 AM)...");

  try {
    const now = new Date();

const startOfToday = new Date(now);
startOfToday.setHours(0, 0, 0, 0);
console.log(startOfToday)
const endOfToday = new Date(now);
endOfToday.setHours(23, 59, 59, 999);
console.log(endOfToday)
await InvestmentPackage.deleteMany({
  packageExpiresAt: { $gte: startOfToday, $lte: endOfToday },
});

console.log("🗑️ Investment packages expired today have been deleted");

    // STEP 1: RESET todayProfit FOR ALL INVESTMENTS
    await UserInvestment.updateMany({}, { todayProfit: 0 });

    // STEP 2: FETCH ACTIVE INVESTMENTS
    const investments = await UserInvestment.find({
      status: "ACTIVE",
      expiresAt: { $gt: now },
    });

    for (const inv of investments) {
      const roiAmount = Number(inv.returnAmount) || 0;
      const totalProfit = Number(inv.totalProfit) || 0;
      const roiCredited = Number(inv.roiCredited) || 0;
      const capital = Number(inv.capital) || 0;
      const returnType = inv.returnType || "DAILY"; // default DAILY
      const startAfter = inv.startAfter || inv.startDate; // delayed packages

      const user = await User.findById(inv.userId);
      if (!user) continue;

      // ✅ Production logic for return types
      // Skip if ROI shouldn't start yet
      if (now < new Date(startAfter)) continue;

      // WEEKLY packages: only credit if 7 days passed since lastROIAt
      if (returnType === "WEEKLY") {
        const lastRoi = inv.lastROIAt || inv.startDate;
        const diffDays = Math.floor((now - new Date(lastRoi)) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) continue;
      }

      // DAILY packages will always credit
      let creditAmount = roiAmount;
     if (roiCredited + roiAmount > totalProfit) {
        creditAmount = totalProfit - roiCredited;
      }
      // Credit user
      user.balance += creditAmount;
      user.totalEarnings += creditAmount;
      await user.save();

      // Update investment
      inv.roiCredited += creditAmount;
      inv.todayProfit = creditAmount;
      inv.lastROIAt = now;

      // COMPLETE PACKAGE
    const epsilon = 0.0001; // tiny number to avoid JS float glitches

if (
  roundForCompare(inv.roiCredited) >= roundForCompare(totalProfit) || // normal ROI completion
  new Date() >= new Date(inv.expiresAt) ||                           // complete on expiry
  inv.roiCredited + epsilon >= totalProfit                          // tiny epsilon buffer
) {
  // Complete the package
  inv.roiCredited = totalProfit;
  inv.status = "COMPLETED";

  if (!inv.capitalReturned) {
    user.investedBalance -= capital;
    user.balance += capital;
    await user.save();
    inv.capitalReturned = true;
  }
}


      await inv.save();
    }

    console.log("✅ ROI cron completed (production)");
  } catch (err) {
    console.error("❌ ROI cron error:", err);
  }
},
 {
    timezone: "Asia/Karachi" // ← THIS IS WHERE YOU SET PK TIME
  }
);
