import express from "express";
import {startDeposit,paymentWebhook,minamount} from "../controllers/depositController.js"
const router = express.Router();
router.post("/deposit",startDeposit ); 
router.get("/min-amount/:currency",minamount)
router.post("/webhook", paymentWebhook)

export default router;
