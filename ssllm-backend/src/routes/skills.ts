import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/skills — List all skills
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, active } = req.query;

    const where: any = {};
    if (category && category !== "all") where.category = category as string;
    if (active !== undefined) where.active = active === "true";

    const skills = await prisma.skill.findMany({
      where,
      include: {
        userSkills: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// GET /api/skills/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: req.params.id },
      include: { userSkills: { include: { user: true } } },
    });

    if (!skill) {
      res.status(404).json({ error: "Skill not found" });
      return;
    }

    res.json(skill);
  } catch (error) {
    console.error("Error fetching skill:", error);
    res.status(500).json({ error: "Failed to fetch skill" });
  }
});

// POST /api/skills — Create skill
router.post("/", async (req: Request, res: Response) => {
  try {
    const skill = await prisma.skill.create({
      data: {
        name: req.body.name,
        category: req.body.category,
        requiredLevel: req.body.requiredLevel || 1,
        active: req.body.active ?? true,
      },
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({ error: "Failed to create skill" });
  }
});

// PUT /api/skills/:id — Update skill
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(skill);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Skill not found" });
      return;
    }
    console.error("Error updating skill:", error);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

// DELETE /api/skills/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ message: "Skill deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Skill not found" });
      return;
    }
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

export default router;
