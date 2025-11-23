import express from "express";
import { getSingleUserData ,deposithistory, getAllUsers} from "../controllers/getSingleUserData.js";
import {getTeamHierarchy} from "../controllers/teamHierarchy.controller.js"

import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/me", getSingleUserData); // GET single user's financial data
router.get("/deposit-history",deposithistory )

router.get("/team", getTeamHierarchy);
router.get("/all", restrictToLoggedinUserOnly,verifyAdmin, getAllUsers);

export default router;
