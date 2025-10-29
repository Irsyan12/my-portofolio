import express from "express";
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
  getCurrentExperience,
  getExperienceTimeline,
  getExperienceStats,
  updateExperiencesOrder,
} from "../controllers/experienceController.js";
import {
  authenticateToken,
  requireAdmin,
  rateLimiter,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getExperiences);
router.get("/current", getCurrentExperience);
router.get("/timeline", getExperienceTimeline);
router.get("/:id", getExperienceById);

// Admin only routes
router.get("/admin/stats", authenticateToken, requireAdmin, getExperienceStats);
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  rateLimiter(20),
  createExperience
);
router.put("/reorder", authenticateToken, requireAdmin, updateExperiencesOrder);
router.put("/:id", authenticateToken, requireAdmin, updateExperience);
router.delete("/:id", authenticateToken, requireAdmin, deleteExperience);

export default router;
