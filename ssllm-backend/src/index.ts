import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import usersRouter from "./routes/users";
import projectsRouter from "./routes/projects";
import skillsRouter from "./routes/skills";
import lecturesRouter from "./routes/lectures";
import recommendationsRouter from "./routes/recommendations";
import certificatesRouter from "./routes/certificates";
import notificationsRouter from "./routes/notifications";
import analyticsRouter from "./routes/analytics";
import chatbotRouter from "./routes/chatbot";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/lectures", lecturesRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/chatbot", chatbotRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 SSLLM Backend running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
