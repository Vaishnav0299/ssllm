import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/recommendations
router.get("/", async (_req: Request, res: Response) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// GET /api/recommendations/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: req.params.id },
    });

    if (!recommendation) {
      res.status(404).json({ error: "Recommendation not found" });
      return;
    }

    res.json(recommendation);
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    res.status(500).json({ error: "Failed to fetch recommendation" });
  }
});

// POST /api/recommendations
router.post("/", async (req: Request, res: Response) => {
  try {
    const recommendation = await prisma.recommendation.create({
      data: req.body,
    });

    res.status(201).json(recommendation);
  } catch (error) {
    console.error("Error creating recommendation:", error);
    res.status(500).json({ error: "Failed to create recommendation" });
  }
});

// PUT /api/recommendations/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const recommendation = await prisma.recommendation.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(recommendation);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Recommendation not found" });
      return;
    }
    console.error("Error updating recommendation:", error);
    res.status(500).json({ error: "Failed to update recommendation" });
  }
});

// DELETE /api/recommendations/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.recommendation.delete({ where: { id: req.params.id } });
    res.json({ message: "Recommendation deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Recommendation not found" });
      return;
    }
    console.error("Error deleting recommendation:", error);
    res.status(500).json({ error: "Failed to delete recommendation" });
  }
});

export default router;
