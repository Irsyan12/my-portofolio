import express from "express";
import {
  getPublicFeedback,
  getAllFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  getTopRatedFeedback,
} from "../controllers/feedbackController.js";
import {
  authenticateToken,
  requireAdmin,
  rateLimiter,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getPublicFeedback);
router.get("/top-rated", getTopRatedFeedback);
router.get("/:id", getFeedbackById);
router.post("/", rateLimiter(3, 30 * 60 * 1000), createFeedback); // 3 feedback per 30 minutes

// Admin only routes
router.get("/admin/all", authenticateToken, requireAdmin, getAllFeedback);
router.get("/admin/stats", authenticateToken, requireAdmin, getFeedbackStats);
router.put("/:id", authenticateToken, requireAdmin, updateFeedback);
router.delete("/:id", authenticateToken, requireAdmin, deleteFeedback);

export default router;
