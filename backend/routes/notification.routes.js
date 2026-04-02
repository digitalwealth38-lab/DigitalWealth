import express from "express";
import {
  getActiveNotifications,
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";
import { restrictToLoggedinUserOnly, verifyAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/",restrictToLoggedinUserOnly, getActiveNotifications);

// Admin only
router.get("/admin", restrictToLoggedinUserOnly, verifyAdmin, getAllNotifications);
router.post("/", restrictToLoggedinUserOnly, verifyAdmin, createNotification);
router.put("/:id", restrictToLoggedinUserOnly, verifyAdmin, updateNotification);
router.delete("/:id", restrictToLoggedinUserOnly, verifyAdmin, deleteNotification);

export default router;