import TeamHierarchy from "../models/TeamHierarchy.js";
import User from "../models/user.model.js";

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
      const users = await User.find({ _id: { $in: ids } }).select("name level referredBy");
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
