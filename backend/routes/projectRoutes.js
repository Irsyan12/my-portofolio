import express from "express";
import {
  getProjects,
  getAllProjectsAdmin,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  getProjectStats,
} from "../controllers/projectController.js";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
  rateLimiter,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/featured", getFeaturedProjects);
router.get("/:id", optionalAuth, getProjectById);

// Admin only routes
router.get("/admin/all", authenticateToken, requireAdmin, getAllProjectsAdmin);
router.get("/admin/stats", authenticateToken, requireAdmin, getProjectStats);
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  rateLimiter(20),
  createProject
);
router.put("/:id", authenticateToken, requireAdmin, updateProject);
router.patch("/:id/featured", authenticateToken, requireAdmin, toggleFeatured);
router.delete("/:id", authenticateToken, requireAdmin, deleteProject);

export default router;
