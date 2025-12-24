import express from "express";
import { getAllPackages,buyPackage, getinvestPackages, buyInvestpackage, getMyInvestment } from "../controllers/packageController.js";

const router = express.Router();
// Get all packages
router.get("/my-investments", getMyInvestment);
router.get("/", getAllPackages);
router.get("/investpackages",getinvestPackages)
router.post("/buyinvestpackages", buyInvestpackage);
router.post("/buy", buyPackage);

export default router;
