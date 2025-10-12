import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken";;
const SECRET = process.env.SECRET;
export function setUser(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email
        },
        SECRET,
        { expiresIn: "1h" }
    );
}

export async function getUser(token) {
    if (!token) return null;
    try {
        // Decode the JWT token
        const decoded = jwt.verify(token, SECRET);
        
        // Fetch user from MongoDB using `_id`
        const user = await userModel.findById(decoded._id);
        
        return user || null;  // ✅ Return full user object
    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return null;
    }
}

