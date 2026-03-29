import { Router, Request, Response } from "express";
import prisma from "../db";

const router = Router();

// GET /api/certificates
router.get("/", async (_req: Request, res: Response) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { issueDate: "desc" },
    });
    res.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
});

// GET /api/certificates/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: req.params.id },
    });

    if (!certificate) {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }

    res.json(certificate);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
});

// POST /api/certificates
router.post("/", async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    data.issueDate = new Date(data.issueDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);

    const certificate = await prisma.certificate.create({ data });
    res.status(201).json(certificate);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "Credential ID already exists" });
      return;
    }
    console.error("Error creating certificate:", error);
    res.status(500).json({ error: "Failed to create certificate" });
  }
});

// PUT /api/certificates/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const data: any = { ...req.body };
    if (data.issueDate) data.issueDate = new Date(data.issueDate);
    if (data.expiryDate) data.expiryDate = new Date(data.expiryDate);

    const certificate = await prisma.certificate.update({
      where: { id: req.params.id },
      data,
    });

    res.json(certificate);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }
    console.error("Error updating certificate:", error);
    res.status(500).json({ error: "Failed to update certificate" });
  }
});

// DELETE /api/certificates/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.certificate.delete({ where: { id: req.params.id } });
    res.json({ message: "Certificate deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Certificate not found" });
      return;
    }
    console.error("Error deleting certificate:", error);
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

export default router;
