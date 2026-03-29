import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/projects — List all projects with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, difficulty, assignedTo } = req.query;

    const where: any = {};
    if (status && status !== "all") where.status = status as string;
    if (difficulty && difficulty !== "all") where.difficulty = difficulty as string;
    if (assignedTo) where.assignedTo = assignedTo as string;

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /api/projects/:id — Get single project
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// POST /api/projects — Create project
router.post("/", async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        difficulty: req.body.difficulty || "Medium",
        status: req.body.status || "Not Started",
        progress: req.body.progress || 0,
        dueDate: new Date(req.body.dueDate),
        mentor: req.body.mentor,
        assignedTo: req.body.assignedTo,
        priority: req.body.priority || "Medium",
        githubUrl: req.body.githubUrl,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// PUT /api/projects/:id — Update project
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });

    res.json(project);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /api/projects/:id — Delete project
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
