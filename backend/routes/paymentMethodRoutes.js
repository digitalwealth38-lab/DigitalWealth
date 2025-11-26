import express from "express";
import {
  createMethod,
  getMethods,
  updateMethod,
  deleteMethod,
  getMethodByName,
} from "../controllers/paymentMethodController.js";

const router = express.Router();

// Admin
router.post("/create", createMethod);
router.get("/", getMethods);
router.put("/:id", updateMethod);
router.delete("/:id", deleteMethod);

// User - fetch by method name
router.get("/name/:method", getMethodByName);

export default router;
