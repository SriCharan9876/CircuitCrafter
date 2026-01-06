import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import RagDoc from "../models/ragDoc.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.ATLASDB_URL, {
  dbName: "ai_system"
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.EMBED_MODEL });

const files = fs.readdirSync("./rag_docs");

for (const file of files) {
  const content = fs.readFileSync(`./rag_docs/${file}`, "utf8");
  const chunks = content.match(/(.|[\r\n]){1,700}/g);

  for (const chunk of chunks) {
    const emb = await model.embedContent(chunk);
    await RagDoc.create({
      text: chunk,
      embedding: emb.embedding.values
    });
  }
}

console.log("✅ Docs embedded into AI brain");
process.exit();
