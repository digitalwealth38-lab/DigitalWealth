import WithdrawLimit from "../models/WithdrawLimit.js";

/**
 * GET withdraw limit
 * (Only one document exists)
 */
export const getWithdrawLimit = async (req, res) => {
  try {
    let limit = await WithdrawLimit.findOne();

    // If not exists, create default
    if (!limit) {
      limit = await WithdrawLimit.create({
        minAmount: 10,
        maxAmount: 100,
        isActive: true,
      });
    }

    res.status(200).json(limit);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CREATE / UPDATE withdraw limit
 */
export const updateWithdrawLimit = async (req, res) => {
  try {
    const { minAmount, maxAmount, isActive } = req.body;

    if (minAmount <= 0 || maxAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Amounts must be greater than 0" });
    }

    if (minAmount >= maxAmount) {
      return res
        .status(400)
        .json({ message: "Min amount must be less than max amount" });
    }

    let limit = await WithdrawLimit.findOne();

    if (!limit) {
      limit = await WithdrawLimit.create({
        minAmount,
        maxAmount,
        isActive,
      });
    } else {
      limit.minAmount = minAmount;
      limit.maxAmount = maxAmount;
      limit.isActive = isActive;
      await limit.save();
    }

    res.status(200).json({
      message: "Withdraw limit updated successfully",
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
