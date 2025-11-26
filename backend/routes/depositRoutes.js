import express from "express";
import {startDeposit,paymentWebhook,minamount} from "../controllers/depositController.js"
import {restrictToLoggedinUserOnly} from "../middleware/auth.middleware.js"

import { createDeposit, getUserDeposits } from "../controllers/manualDepositController.js";
const router = express.Router();
router.post("/deposit",restrictToLoggedinUserOnly,startDeposit ); 
router.get("/min-amount/:currency",minamount)
router.post("/deposit/create",restrictToLoggedinUserOnly, createDeposit)
router.get("/deposit/my",restrictToLoggedinUserOnly, getUserDeposits)
router.post("/webhook", paymentWebhook)

export default router;
