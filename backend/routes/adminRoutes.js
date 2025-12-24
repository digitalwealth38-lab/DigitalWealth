import express from "express";
import { deleteInvestPackage, deletePackage, deleteUserByAdmin, getAdminStats, getAdminTrading, toggleBlockUser, updateAdminTrading, updateInvestPackage, updatePackage, Userinvestment } from "../controllers/adminController.js";
import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";
import { getAllWithdrawals, updateWithdrawalStatus } from "../controllers/withdrawalController.js";
import { createinvestPackage, createPackage } from "../controllers/packageController.js";
import { getAllDeposits, updateDepositStatus } from "../controllers/manualDepositController.js";
import { getWithdrawLimit, updateWithdrawLimit } from "../controllers/withdrawLimit.controller.js";

const router = express.Router();

// Only admin users can access this
router.get("/stats",restrictToLoggedinUserOnly, verifyAdmin, getAdminStats);
router.get("/withdrawals",restrictToLoggedinUserOnly, verifyAdmin, getAllWithdrawals);
router.get("/deposits", restrictToLoggedinUserOnly, verifyAdmin, getAllDeposits);
router.put("/deposits/:id", restrictToLoggedinUserOnly, verifyAdmin, updateDepositStatus);
router.put("/:id",restrictToLoggedinUserOnly, verifyAdmin, updatePackage);
router.delete("/:id", restrictToLoggedinUserOnly,verifyAdmin, deletePackage);
router.post("/package",restrictToLoggedinUserOnly, verifyAdmin, createPackage);
router.post("/investpackage",restrictToLoggedinUserOnly, verifyAdmin, createinvestPackage);
router.put("/investpackage/:id",restrictToLoggedinUserOnly, verifyAdmin, updateInvestPackage);
router.delete("/investpackage/:id",restrictToLoggedinUserOnly, verifyAdmin, deleteInvestPackage);
router.get("/user-investments/:userId",restrictToLoggedinUserOnly,verifyAdmin,Userinvestment)
router.delete("/delete-user/:userId",restrictToLoggedinUserOnly,verifyAdmin,deleteUserByAdmin)
router.patch("/block-user/:userId",restrictToLoggedinUserOnly,verifyAdmin,toggleBlockUser)
router.put("/withdrawals/:id",restrictToLoggedinUserOnly, verifyAdmin, updateWithdrawalStatus);
router.get("/admin-trading", restrictToLoggedinUserOnly,verifyAdmin, getAdminTrading);
router.post("/admin-trading", restrictToLoggedinUserOnly,verifyAdmin, updateAdminTrading);
router.post("/withdraw-limit", restrictToLoggedinUserOnly, verifyAdmin, updateWithdrawLimit);
router.get("/withdraw-limit", restrictToLoggedinUserOnly, getWithdrawLimit);


export default router;
