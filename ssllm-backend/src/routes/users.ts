import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/users — List all users with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { department, search, status } = req.query;

    const where: any = {};
    if (department && department !== "all") {
      where.department = department as string;
    }
    if (status && status !== "all") {
      where.status = status as string;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { email: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: { skills: { include: { skill: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/users/:id — Get single user
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        skills: { include: { skill: true } },
        notifications: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/users — Create user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, role, department, avatar, status } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        department,
        avatar,
        status: status || "Active",
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "A user with this email already exists" });
      return;
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PUT /api/users/:id — Update user
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        lastActive: new Date(),
      },
    });

    res.json(user);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /api/users/:id — Delete user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "User not found" });
      return;
    }
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
