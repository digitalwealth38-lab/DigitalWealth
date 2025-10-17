import express from "express";
import { getAllPackages,buyPackage } from "../controllers/packageController.js";

const router = express.Router();
// Get all packages
router.get("/", getAllPackages);
router.post("/buy", buyPackage);

export default router;
