import express from "express";
import {
  trackVisit,
  getAnalytics,
  getRealTimeStats,
  getVisitTrends,
} from "../controllers/visitController.js";
import {
  authenticateToken,
  requireAdmin,
  rateLimiter,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/track", rateLimiter(100, 15 * 60 * 1000), trackVisit); // 100 visits per 15 minutes

// Admin only routes
router.get("/analytics", authenticateToken, requireAdmin, getAnalytics);
router.get("/realtime", authenticateToken, requireAdmin, getRealTimeStats);
router.get("/trends", authenticateToken, requireAdmin, getVisitTrends);

export default router;
