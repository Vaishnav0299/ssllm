import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/lectures — List all lectures
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && status !== "all") where.status = status as string;

    const lectures = await prisma.lecture.findMany({
      where,
      orderBy: { date: "desc" },
    });

    res.json(lectures);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    res.status(500).json({ error: "Failed to fetch lectures" });
  }
});

// GET /api/lectures/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const lecture = await prisma.lecture.findUnique({
      where: { id: req.params.id },
    });

    if (!lecture) {
      res.status(404).json({ error: "Lecture not found" });
      return;
    }

    res.json(lecture);
  } catch (error) {
    console.error("Error fetching lecture:", error);
    res.status(500).json({ error: "Failed to fetch lecture" });
  }
});

// POST /api/lectures
router.post("/", async (req: Request, res: Response) => {
  try {
    const lecture = await prisma.lecture.create({
      data: {
        title: req.body.title,
        instructor: req.body.instructor,
        date: new Date(req.body.date),
        duration: req.body.duration,
        description: req.body.description,
        status: req.body.status || "upcoming",
        joinUrl: req.body.joinUrl,
        recordingUrl: req.body.recordingUrl,
      },
    });

    res.status(201).json(lecture);
  } catch (error) {
    console.error("Error creating lecture:", error);
    res.status(500).json({ error: "Failed to create lecture" });
  }
});

// PUT /api/lectures/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    if (data.date) data.date = new Date(data.date);

    const lecture = await prisma.lecture.update({
      where: { id: req.params.id },
      data,
    });

    res.json(lecture);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Lecture not found" });
      return;
    }
    console.error("Error updating lecture:", error);
    res.status(500).json({ error: "Failed to update lecture" });
  }
});

// DELETE /api/lectures/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.lecture.delete({ where: { id: req.params.id } });
    res.json({ message: "Lecture deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Lecture not found" });
      return;
    }
    console.error("Error deleting lecture:", error);
    res.status(500).json({ error: "Failed to delete lecture" });
  }
});

export default router;
