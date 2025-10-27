import express from "express";
import {gethomestat} from "../controllers/gethomestat.js"
const router = express.Router();
// Get all packages
router.get("/stat", gethomestat);
export default router;