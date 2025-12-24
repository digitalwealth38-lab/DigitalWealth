import express from "express";
import { getSingleUserData ,deposithistory, getAllUsers,searchUsers} from "../controllers/getSingleUserData.js";
import getUnactiveReferredMembers, {getTeamHierarchy} from "../controllers/teamHierarchy.controller.js"

import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";
import {  getUsertransfer, transferMoney } from "../controllers/transferController.js";

const router = express.Router();
router.get("/me", getSingleUserData); // GET single user's financial data
router.get("/deposit-history",deposithistory )
router.get("/search", searchUsers);
router.post("/transfer", transferMoney);
router.get("/transfer-history", getUsertransfer);
router.get("/team", getTeamHierarchy);
router.get("/unactive-members", getUnactiveReferredMembers);
router.get("/all", restrictToLoggedinUserOnly,verifyAdmin, getAllUsers);

export default router;
