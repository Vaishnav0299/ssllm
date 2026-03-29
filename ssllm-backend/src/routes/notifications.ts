import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/notifications
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, unreadOnly } = req.query;

    const where: any = {};
    if (userId) where.userId = userId as string;
    if (unreadOnly === "true") where.read = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { timestamp: "desc" },
    });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// POST /api/notifications
router.post("/", async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: req.body.title,
        message: req.body.message,
        type: req.body.type || "info",
        userId: req.body.userId,
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
});

// PUT /api/notifications/:id/read — Mark as read
router.put("/:id/read", async (req: Request, res: Response) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json(notification);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

// PUT /api/notifications/read-all — Mark all as read
router.put("/read-all", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const where: any = { read: false };
    if (userId) where.userId = userId as string;

    await prisma.notification.updateMany({
      where,
      data: { read: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

// DELETE /api/notifications/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: "Notification deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Notification not found" });
      return;
    }
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
