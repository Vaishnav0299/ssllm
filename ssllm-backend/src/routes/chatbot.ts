import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

// Initialize Google AI
// The API key should be in your .env file as GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Use gemini-1.5-flash for fast responses
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the SkillSpark AI Learning Assistant. Your goal is to help interns and students track their skills, plan their learning, and succeed in their projects. Be encouraging, professional, and concise. You have access to information about their dashboard, which includes skills, projects, and lectures. If they ask about their progress, remind them to check their 'Progress Tracking' page.",
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({ error: "Failed to generate AI response. Make sure GEMINI_API_KEY is set in .env" });
  }
});

export default router;
