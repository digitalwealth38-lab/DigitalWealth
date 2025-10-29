import express from "express";
import {startDeposit,paymentWebhook,minamount} from "../controllers/depositController.js"
import {restrictToLoggedinUserOnly} from "../middleware/auth.middleware.js"
const router = express.Router();
router.post("/deposit",restrictToLoggedinUserOnly,startDeposit ); 
router.get("/min-amount/:currency",minamount)
router.post("/webhook", paymentWebhook)

export default router;
