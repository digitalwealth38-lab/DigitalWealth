import cron from "node-cron";
import UserAsset from "../models/UserAsset.js";
import User from "../models/user.model.js";

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running investment expiry cron...");

    const today = new Date();
  
    const investments = await UserAsset.find({
      active: true,
    });
console.log(investments)
    for (const investment of investments) {

      const daysPassed = Math.floor(
        (today - new Date(investment.startDate)) /
          (1000 * 60 * 60 * 24)
      );

      // Expire after duration
      if (daysPassed >= investment.duration) {
           if (!investment.capitalReturned) {
          const user = await User.findById(investment.user);
          if (user) {
            user.balance += investment.investedAmount;
            user.investedBalance = Math.max(0, user.investedBalance - investment.investedAmount);
            await user.save();
            investment.capitalReturned = true;
            console.log(`💰 Capital returned for user: ${user._id}`);
          }
        }

        investment.active = false;

        await investment.save();

        console.log(
          `Investment expired: ${investment._id}`
        );
      }
    }
  } catch (error) {
    console.log("Cron Error:", error);
  }
});