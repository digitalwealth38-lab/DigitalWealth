import express from "express";
import { getSingleUserData } from "../controllers/getSingleUserData.js";

const router = express.Router();
router.get("/me", getSingleUserData); // GET single user's financial data

export default router;
