import express from "express";
import {
  createWithdrawal,
  getUserWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
} from "../controllers/withdrawalController.js";
import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🧑‍💼 User routes
router.post("/", restrictToLoggedinUserOnly, createWithdrawal);
router.get("/history", restrictToLoggedinUserOnly, getUserWithdrawals);

// 👑 Admin routes
router.get("/admin/all", verifyAdmin, getAllWithdrawals);
router.put("/admin/update/:id", verifyAdmin, updateWithdrawalStatus);

export default router;
