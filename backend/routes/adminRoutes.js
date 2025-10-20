import express from "express";
import { getAdminStats, updatePackage } from "../controllers/adminController.js";
import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";
import { getAllWithdrawals, updateWithdrawalStatus } from "../controllers/withdrawalController.js";

const router = express.Router();

// Only admin users can access this
router.get("/stats",restrictToLoggedinUserOnly, verifyAdmin, getAdminStats);
router.get("/withdrawals",restrictToLoggedinUserOnly, verifyAdmin, getAllWithdrawals);
router.put("/:id",restrictToLoggedinUserOnly, verifyAdmin, updatePackage);
router.put("/withdrawals/:id",restrictToLoggedinUserOnly, verifyAdmin, updateWithdrawalStatus);

export default router;
