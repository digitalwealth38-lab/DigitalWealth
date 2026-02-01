// backend/lib/logActivity.js
import ActivityLog from "../models/ActivityLog.js";

/**
 * Logs an activity for a user
 * @param {ObjectId} userId - MongoDB user ID
 * @param {String} type - Action type: LOGIN, DEPOSIT, WITHDRAW, INVEST, etc.
 * @param {String} description - Description of the activity
 * @param {Number} amount - Optional amount for financial actions
 */
export const logActivity = async (userId, type, description, amount = null) => {
  try {
    await ActivityLog.create({
      userId,
      type,
      description,
      amount,
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
};
