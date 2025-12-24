import TeamHierarchy from "../models/TeamHierarchy.js";
import User from "../models/user.model.js";

const getUnactiveReferredMembers = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user

    // Step 1: Get your referral code
    const user = await User.findById(userId).select("referralCode");
    if (!user) return res.status(404).json({ message: "User not found" });

    const referralCode = user.referralCode;

    // Step 2: Find all users referred by you with isActive = false
    const unactiveMembers = await User.find({
      referredBy: referralCode,
      hasActivePackage: false
    }).select("name email referralCode"); // select only the fields you want

    res.json(unactiveMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default getUnactiveReferredMembers;

// 🔹 Get hierarchy of logged-in user with member details
export const getTeamHierarchy = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ From JWT

    // Fetch user's hierarchy
    const hierarchy = await TeamHierarchy.findOne({ userId });
    if (!hierarchy) {
      return res.status(404).json({ message: "Hierarchy not found" });
    }

    // Helper to get user details from an array of IDs
    const getUserDetails = async (ids, level) => {
      const users = await User.find({ _id: { $in: ids } }).select(" userId name level referredBy");
      return users.map((user) => ({
        userId:user.userId,
        _id: user._id,
        name: user.name,
        level: level, // use the hierarchy level
        referredBy: user.referredBy || hierarchy.userId, // if null, top user referred
      }));
    };

    const level1Users = await getUserDetails(hierarchy.level1Members, 1);
    const level2Users = await getUserDetails(hierarchy.level2Members, 2);
    const level3Users = await getUserDetails(hierarchy.level3Members, 3);

    // Return hierarchy along with user details
    res.status(200).json({
      success: true,
      hierarchy: {
        userId: hierarchy.userId,
        level1Members: level1Users,
        level2Members: level2Users,
        level3Members: level3Users,
      },
    });
    
    console.log("Hierarchy fetched:", hierarchy);
  } catch (error) {
    console.error("❌ Error fetching hierarchy:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
