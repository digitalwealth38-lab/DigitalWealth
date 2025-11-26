import express from "express";
import {
  createLocalWithdraw,
  getUserLocalWithdrawals,
  getAllLocalWithdrawals,
  updateLocalWithdrawStatus,
} from "../controllers/localWithdrawController.js";

import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ User creates local withdrawal
router.post("/withdraw/create", restrictToLoggedinUserOnly, createLocalWithdraw);

// ✅ User fetch history
router.get("/history", restrictToLoggedinUserOnly, getUserLocalWithdrawals);

// ✅ Admin fetch all withdrawals
router.get("/all", restrictToLoggedinUserOnly, verifyAdmin, getAllLocalWithdrawals);

// ✅ Admin update status
router.put("/:id", restrictToLoggedinUserOnly, verifyAdmin, updateLocalWithdrawStatus);

export default router;
