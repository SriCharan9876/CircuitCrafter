import express from "express";
import { chatWithAI, getChatHistory } from "../ai/chat.js";
import { auth } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { analyzeCircuit } from "../controllers/aiCircuit.js";

const router = express.Router();

router.post("/chat", auth, async (req, res) => {
  const reply = await chatWithAI(req.body.message, req.user._id);
  res.json({ reply });
});

router.get("/history", auth, async (req, res) => {
  const history = await getChatHistory(req.user._id);
  res.json({ history });
});

router.post("/analyze-circuit", upload.single("circuitImage"), analyzeCircuit);

export default router;
