import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/comment.controller";

const router = Router();

router.get("/", authenticateToken, getNotifications);
router.put("/:id/read", authenticateToken, markNotificationAsRead);

export default router;
