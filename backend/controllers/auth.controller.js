import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

import admin from "../firebase.js";
import { setUser } from "../services/auth.service.js";
import dotenv from "dotenv";
dotenv.config();


export const googleLogin = async (req, res) => {
  const { token, referredBy } = req.body; // frontend should send optional referredBy

  try {
    // 🔍 Verify Google token
    const decoded = await admin.auth().verifyIdToken(token);

    // 🧠 Find existing user
    let user = await User.findOne({ email: decoded.email });

    // 🆕 If user doesn't exist → create new
    if (!user) {
      const referralCode = `USR-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      user = new User({
        name: decoded.name || decoded.email.split("@")[0],
        email: decoded.email,
        password: decoded.email, // dummy password since Google user
        referralCode,
        referredBy: referredBy || null,
        googleId: decoded.uid,
      });

      await user.save();

      // 🎁 If referredBy exists → give referral rewards
      if (referredBy) {
        const referrer = await User.findOne({ referralCode: referredBy });

        if (referrer) {
          const rewardAmount = 5; // customize reward logic
          referrer.directReferrals += 1;
          referrer.teamSize += 1;
          referrer.balance += rewardAmount;
          referrer.totalEarnings += rewardAmount;

          referrer.rewards.push({
            type: "Referral Bonus",
            amount: rewardAmount,
          });

          await referrer.save();
        }
      }
    }

    // 🔐 Generate your own JWT
    const appToken = setUser(user);

    // 🍪 Set cookie
    res.cookie("uid", appToken, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Send success response
    res.status(200).json({
      message: "Google login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
      },
      token: appToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid Google token",
      error: error.message,
    });
  }
};
export const signup = async (req, res) => {
  const { name, email, password, referredBy } = req.body; // add referredBy in body

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // 🔐 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🎯 Generate a unique referral code
    const referralCode = `USR-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // ✨ Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      referralCode,
      referredBy: referredBy || null,
    });

    await newUser.save();

    // 🎁 If referredBy exists → reward the referrer
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });

      if (referrer) {
        const rewardAmount = 5; // USD or points
        referrer.directReferrals += 1;
        referrer.teamSize += 1;
        referrer.balance += rewardAmount;
        referrer.totalEarnings += rewardAmount;

        referrer.rewards.push({
          type: "Referral Bonus",
          amount: rewardAmount,
        });

        await referrer.save();
      }
    }

    // 🧾 Create JWT token
    const token = setUser(newUser);
    res.cookie("uid", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
    });

    // ✅ Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode,
        referredBy: newUser.referredBy,
      },
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const login=async(req,res)=>{
  const {email,password}=req.body
   try {
 const user= await User.findOne({email})
 if(!user){
  return res.status(400).json({ message: "Invalid Credentials" });
}
const iscorrectPassword= await bcrypt.compare(password,user.password)
if(!iscorrectPassword){
  return res.status(400).json({ message: "Invalid Credentials" });
}
  const token = setUser(user);
  res.cookie("uid", token, { 
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "None", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
   });
res.status(200).json({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
  message: "Login successful"
});


   } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
}
export const logout = (req, res) => {
  try {
    res.clearCookie("uid", {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
    });
   return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


