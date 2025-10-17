import mongoose from "mongoose";

/**
 * This schema keeps track of the team structure up to multiple levels.
 * Example:
 * - userId: the current user
 * - directReferrals: people referred directly by this user
 * - level2Members: referrals made by directReferrals
 * - level3Members: referrals made by level2Members
 */

const TeamHierarchySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Level 1 = Direct referrals
    level1Members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // Level 2 = Members referred by level 1
    level2Members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // Level 3 = Members referred by level 2
    level3Members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    // Track total team count
    totalTeamCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

//
// 🔹 Utility Function (optional)
// Update the total team count automatically before save
//
TeamHierarchySchema.pre("save", function (next) {
  this.totalTeamCount =
    this.level1Members.length +
    this.level2Members.length +
    this.level3Members.length;
  next();
});

const TeamHierarchy = mongoose.model("TeamHierarchy", TeamHierarchySchema);
export default TeamHierarchy;
