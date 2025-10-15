import { getUser } from "../services/auth.service.js";

// 🔒 Middleware for logged-in users
export async function restrictToLoggedinUserOnly(req, res, next) {
  try {
    const userUid = req.cookies?.uid;
    if (!userUid) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const user = await getUser(userUid);
    if (!user) {
      return res.status(401).json({ message: "Invalid token or session expired" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// 👑 Middleware for admins
export function verifyAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    next();
  } catch (error) {
    console.error("❌ Admin middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
