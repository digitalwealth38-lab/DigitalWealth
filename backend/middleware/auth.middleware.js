import { getUser } from "../services/auth.service.js";
export async function restrictToLoggedinUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;
    if (!userUid){
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const user = await getUser(userUid);
    if (!user) return res.redirect("/login");
    req.user = user;
    next();
  }