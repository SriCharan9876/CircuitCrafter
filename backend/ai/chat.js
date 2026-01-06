import RagDoc from "../models/ragDoc.js";
import AIChat from "../models/aiChat.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./prompts.js";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: process.env.CHAT_MODEL || "gemini-2.5-flash" });
const embedModel = genAI.getGenerativeModel({ model: process.env.EMBED_MODEL || "gemini-embedding-001" });

export async function chatWithAI(message, userId) {
    const history = await AIChat.find({ userId }).sort({ createdAt: -1 }).limit(6).lean();
    const past = history.reverse().map(h => `${h.role}: ${h.message}`).join("\n");

    const emb = await embedModel.embedContent(message);

    const docs = await RagDoc.aggregate([
        {
            $vectorSearch: {
                index: "kb_vector_index",
                path: "embedding",
                queryVector: emb.embedding.values,
                numCandidates: 100,
                limit: 5
            }
        }
    ]);

    const context = docs.map(d => d.text).join("\n");

    const prompt = `
${SYSTEM_PROMPT}

Conversation:
${past}

Documentation:
${context}

User: ${message}
`;

    const result = await chatModel.generateContent(prompt);
    const reply = result.response.text();

    await AIChat.create({ userId, role: "user", message });
    await AIChat.create({ userId, role: "assistant", message: reply });

    return reply;
}

export async function getChatHistory(userId) {
    const history = await AIChat.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    // Return in chronological order
    return history.reverse().map(msg => ({
        role: msg.role === 'assistant' ? 'bot' : 'user',
        message: msg.message,
        createdAt: msg.createdAt
    }));
}
