import express from "express";
import {restrictToLoggedinUserOnly} from "../middleware/auth.middleware.js"
import { buyAsset, claimAssetReward, getMyAssets } from "../controllers/userAssetController.js";
const router = express.Router();
router.post("/buy", restrictToLoggedinUserOnly, buyAsset);
router.post("/claim", restrictToLoggedinUserOnly, claimAssetReward);
router.get("/my-assets", restrictToLoggedinUserOnly, getMyAssets);
export default router;