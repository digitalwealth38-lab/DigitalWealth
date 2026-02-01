import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import crypto from "crypto";
import nodemailer from "nodemailer";
import admin from "../firebase.js";
import { setUser } from "../services/auth.service.js";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import { logActivity } from "../lib/logActivity.js";

dotenv.config();
export const generateUserId = async () => {
  let id;

  while (true) {
    // Generate 6-digit number
    id = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if unique
    const exists = await User.findOne({ userId: id });
    if (!exists) break;
  }

  return id;
};

export const googleLogin = async (req, res) => {
  const { token, referredBy } = req.body; // frontend should send optional referredBy

  try {
    // 🔍 Verify Google token
    const decoded = await admin.auth().verifyIdToken(token);
console.log(decoded)
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
        password: crypto.randomBytes(16).toString("hex"),
        profilePic:decoded.picture, // dummy password since Google user
        referralCode,
        referredBy: referredBy || null,
        googleId: decoded.uid,
        userId: await generateUserId(),
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
       await logActivity(user._id, "SIGNUP", "User registered successfully via Google");
    }

    // 🔐 Generate your own JWT
    const appToken = setUser(user);
await logActivity(user._id, "LOGIN", "User logged in via Google");
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
        isAdmin: user.isAdmin,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        userId:user.userId,
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
  const { name, email, password, referredBy } = req.body;

  try {
    // 1️⃣ Validate fields
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

    // 2️⃣ Verify referral code (if provided)
    let validReferral = null;
    if (referredBy) {
      const refUser = await User.findOne({ referralCode: referredBy });
      if (!refUser) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
      validReferral = refUser.referralCode;
    }
    // 3️⃣ Create user (referralCode auto-generated in MongoDB)
    const newUser = new User({
      name,
      email,
      password,
      referredBy: validReferral || null,
      userId: await generateUserId(),
    });

    await newUser.save();

    // 4️⃣ Generate JWT token
    const token = setUser(newUser);
    res.cookie("uid", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
    });
await logActivity(newUser._id, "SIGNUP", "User registered successfully");
    // ✅ 5️⃣ Success Response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        referralCode: newUser.referralCode, // auto from model
        referredBy: newUser.referredBy,
        userId:newUser.userId,
      },
    });
  } catch (error) {
    console.error("❌ Error in signup controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
  await logActivity(user._id, "LOGIN", "User logged in");
res.status(200).json({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  isAdmin: user.isAdmin,
  profilePic: user.profilePic,
   userId:user.userId,
  message: "Login successful",
 
});

   } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
}
export const logout = async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log(userId)
     // Assuming req.user is set by your auth middleware

    // Log the logout activity if user is available
    if (userId) {
      await logActivity(userId, "LOGOUT", "User logged out");
    }

    // Clear the cookie
    res.clearCookie("uid", {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV !== "development",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
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
export async function sendEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Digital Wealth" <no-reply@digitalwealthpk.com>`, // Must match verified domain
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }
}
export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await User.findOne({ email: email.toLowerCase() });

  const genericResponse = { message: "If an account exists for that email, we sent a reset link." };
  if (!user) return res.status(200).json(genericResponse);

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Save token and expiry (1 hour)
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  const html = `
    <p>Hello ${user.name || ""},</p>
    <p>You requested a password reset. Click the link below to set a new password (valid for 1 hour):</p>
    <p><a href="${resetUrl}">Reset Password</a></p>
    <p>If you did not request this, ignore this email.</p>
  `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Digital Wealth — Reset your password",
      html,
    });
    return res.status(200).json(genericResponse);
  } catch (err) {
    // Clean up token if email fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.error("Password reset email failed:", err);
    return res.status(500).json({ message: "Unable to send reset email" });
  }
}

export async function resetPassword(req, res) {
  const { token, email, password } = req.body;

  if (!token || !email || !password) return res.status(400).json({ message: "Missing fields" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    email: email.toLowerCase(),
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.password = password; // will be hashed via pre-save
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // optional: issue JWT or inform user to log in
  return res.status(200).json({ message: "Password updated successfully" });
}

export const updateProfile =async (req, res)=>{
try {
  const {profilePic}=req.body
  const userId=req.user._id
if(!profilePic){
  return res.status(400).json({message:"profile pic is required"})
}
const uploadResponse= await cloudinary.uploader.upload(profilePic)
const updateUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
res.status(200).json(updateUser)
} catch (error) {
  console.log("error in  update profile",error)
  res.status(500).json({ message: "Internal Server Error" });
}
}
export const updateProfileData = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      oldPassword: rawOldPassword,
      newPassword: rawNewPassword,
      profilePic,
      referredBy, // ✅ added field for referral update
    } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      console.error("No user id on req.user");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Handle referral code logic
    if (referredBy) {
      // If user tries to change it but already bought a package
      if (user.hasActivePackage && referredBy !== user.referredBy) {
        return res.status(400).json({
          message:
            "You cannot change the referral code because you already bought a package.",
        });
      }

      // If same referral code → just proceed (no error)
      if (referredBy === user.referredBy) {
        // Do nothing special, let it pass to normal update
      } else if (!user.hasActivePackage) {
        // Allow change only if user has no active package
        user.referredBy = referredBy;
      }
    }

    // update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (profilePic) user.profilePic = profilePic;

    // If requesting a password change
    if (rawOldPassword && rawNewPassword) {
      // Normalize / sanitize inputs
      const oldPassword = typeof rawOldPassword === "string" ? rawOldPassword.trim() : rawOldPassword;
      const newPassword = typeof rawNewPassword === "string" ? rawNewPassword.trim() : rawNewPassword;

      let isMatch = false;

      // If stored password looks like a bcrypt hash (covers $2b$, $2y$, $2a$)
      if (typeof user.password === "string" && user.password.startsWith("$2")) {
        try {
          // Try direct compare
          isMatch = await bcrypt.compare(oldPassword, user.password);

          // If first compare fail, also try trimmed and Unicode-normalized variants
          if (!isMatch) {
            const oldTrim = (oldPassword || "").trim();
            if (oldTrim !== oldPassword) {
              isMatch = await bcrypt.compare(oldTrim, user.password);
            }
          }
          if (!isMatch) {
            // Try NFC normalization (helps with invisible/combining characters)
            const n1 = typeof oldPassword === "string" ? oldPassword.normalize("NFC") : oldPassword;
            const n2 = typeof oldPassword === "string" ? oldPassword.normalize("NFKC") : oldPassword;
            if (n1 !== oldPassword) isMatch = await bcrypt.compare(n1, user.password);
            if (!isMatch && n2 !== oldPassword) isMatch = await bcrypt.compare(n2, user.password);
          }
        } catch (cmpErr) {
          console.error("bcrypt.compare error:", cmpErr);
        }
      } else {
        // Stored password does not look hashed — fallback to plain equality check (Google user or legacy)
        console.log("Stored password is NOT a bcrypt hash, doing direct equality check");
        isMatch = user.password === oldPassword || user.password === rawOldPassword;
      }

      console.log("final isMatch:", isMatch);

      if (!isMatch) {
        // Helpful hint in logs for debugging; respond generic to frontend
        console.warn("Password compare failed for user:", userId.toString());
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      // Hash the new password and save (hash manually to avoid any pre-save double-hash confusion)
      const hashed = await bcrypt.hash(newPassword, 10);

      // Use findByIdAndUpdate to avoid pre-save double-hash (or you can assign & markModified)
      await User.findByIdAndUpdate(user._id, { password: hashed });

      // refresh user object for response (without password)
      const updatedUser = await User.findById(user._id).select("-password");
      return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    }

    // If no password change: just save other fields (use save to trigger referral logic etc.)
    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

