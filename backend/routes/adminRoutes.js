import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only admin users can access this
router.get("/stats",restrictToLoggedinUserOnly, verifyAdmin, getAdminStats);

export default router;
