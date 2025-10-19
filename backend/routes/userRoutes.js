import express from "express";
import { getSingleUserData ,deposithistory} from "../controllers/getSingleUserData.js";
import {getTeamHierarchy} from "../controllers/teamHierarchy.controller.js"

const router = express.Router();
router.get("/me", getSingleUserData); // GET single user's financial data
router.get("/deposit-history",deposithistory )
router.get("/team", getTeamHierarchy);

export default router;
