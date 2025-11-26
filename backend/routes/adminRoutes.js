import express from "express";
import { deletePackage, getAdminStats, updatePackage } from "../controllers/adminController.js";
import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";
import { getAllWithdrawals, updateWithdrawalStatus } from "../controllers/withdrawalController.js";
import { createPackage } from "../controllers/packageController.js";
import { getAllDeposits, updateDepositStatus } from "../controllers/manualDepositController.js";

const router = express.Router();

// Only admin users can access this
router.get("/stats",restrictToLoggedinUserOnly, verifyAdmin, getAdminStats);
router.get("/withdrawals",restrictToLoggedinUserOnly, verifyAdmin, getAllWithdrawals);
router.get("/deposits", restrictToLoggedinUserOnly, verifyAdmin, getAllDeposits);
router.put("/deposits/:id", restrictToLoggedinUserOnly, verifyAdmin, updateDepositStatus);
router.put("/:id",restrictToLoggedinUserOnly, verifyAdmin, updatePackage);
router.delete("/:id", restrictToLoggedinUserOnly,verifyAdmin, deletePackage);
router.post("/package",restrictToLoggedinUserOnly, verifyAdmin, createPackage);

router.put("/withdrawals/:id",restrictToLoggedinUserOnly, verifyAdmin, updateWithdrawalStatus);

export default router;
