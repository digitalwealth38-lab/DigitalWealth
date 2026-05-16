import express from "express"
import {
createAsset,
    deleteAsset,
getAssets,
updateAsset,
} from "../controllers/assetController.js";
import {restrictToLoggedinUserOnly,verifyAdmin} from "../middleware/auth.middleware.js"

const router = express.Router();
router.post("/create",restrictToLoggedinUserOnly,verifyAdmin,createAsset);
router.get("/", getAssets);
router.put("/update/:assetId",restrictToLoggedinUserOnly,verifyAdmin, updateAsset);
router.delete("/:assetId",restrictToLoggedinUserOnly,verifyAdmin, deleteAsset);

export default router;
