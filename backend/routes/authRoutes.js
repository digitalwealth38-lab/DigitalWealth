import express from "express"
const router =express.Router();
import {login, logout, signup,checkAuth, forgotPassword, resetPassword} from "../controllers/auth.controller.js"
import { googleLogin } from "../controllers/auth.controller.js";
import {restrictToLoggedinUserOnly} from "../middleware/auth.middleware.js"
router.post("/google-login", googleLogin)
router.post("/signup",signup)
router.post("/login",login)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout",logout)
router.get("/check", restrictToLoggedinUserOnly, checkAuth);
export default router