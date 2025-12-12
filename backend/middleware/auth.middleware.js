import { getUser } from "../services/auth.service.js";

// 🔒 Middleware for logged-in users
export async function restrictToLoggedinUserOnly(req, res, next) {
  try {
    let token;

    // 1️⃣ Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Fallback to cookie
    if (!token && req.cookies?.uid) {
      token = req.cookies.uid;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // ✅ Get user from token
    const user = await getUser(token);
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

    // ✅ Use isAdmin instead of role
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    next();
  } catch (error) {
    console.error("❌ Admin middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

