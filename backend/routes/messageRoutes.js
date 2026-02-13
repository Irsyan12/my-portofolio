import express from "express";
import {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageStatus,
  toggleStar,
  deleteMessage,
  getMessageStats,
  getRecentMessages,
} from "../controllers/messageController.js";
import {
  authenticateToken,
  requireAdmin,
  rateLimiter,
} from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/", rateLimiter(5, 10 * 60 * 1000), createMessage); // 5 messages per 10 minutes

// Admin only routes
router.get("/", authenticateToken, requireAdmin, getMessages);
router.get("/stats", authenticateToken, requireAdmin, getMessageStats);
router.get("/recent", authenticateToken, requireAdmin, getRecentMessages);
router.get("/:id", authenticateToken, requireAdmin, getMessageById);
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  updateMessageStatus
);
router.patch("/:id/star", authenticateToken, requireAdmin, toggleStar);
router.delete("/:id", authenticateToken, requireAdmin, deleteMessage);

export default router;
