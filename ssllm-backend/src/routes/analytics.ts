import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/analytics — Aggregated analytics data
router.get("/", async (_req: Request, res: Response) => {
  try {
    // Fetch analytics entries grouped by category
    const entries = await prisma.analyticsEntry.findMany({
      orderBy: { key: "asc" },
    });

    // Group entries by category
    const skillProgress = entries
      .filter((e) => e.category === "skillProgress")
      .map((e) => ({ month: e.key, completed: e.value }));

    const learningHours = entries
      .filter((e) => e.category === "learningHours")
      .map((e) => ({ day: e.key, hours: e.value }));

    // Get dynamic Skill Distribution from actual UserSkills
    const allUserSkills = await prisma.userSkill.findMany({
      include: { skill: true }
    });
    
    const catMap: Record<string, number> = {};
    allUserSkills.forEach(us => {
      const cat = us.skill.category;
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    
    const skillDistribution = Object.entries(catMap).map(([category, value]) => ({ 
      category, 
      value 
    }));

    // Aggregate stats
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({ where: { status: "Active" } });
    const totalProjects = await prisma.project.count();
    const completedProjects = await prisma.project.count({ where: { status: "Completed" } });
    const totalSkills = await prisma.skill.count();
    const activeSkills = await prisma.skill.count({ where: { active: true } });

    res.json({
      skillProgress,
      learningHours,
      skillDistribution,
      stats: {
        totalUsers,
        activeUsers,
        totalProjects,
        completedProjects,
        totalSkills,
        activeSkills,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

export default router;
