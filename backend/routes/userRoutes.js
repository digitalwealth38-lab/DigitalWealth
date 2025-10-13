import express from "express";
import { getSingleUserData ,deposithistory} from "../controllers/getSingleUserData.js";

const router = express.Router();
router.get("/me", getSingleUserData); // GET single user's financial data
router.get("/deposit-history",deposithistory )

export default router;
