import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import RagDoc from "../models/ragDoc.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect("mongodb+srv://whitedwarf3407:xEQ87DgcRx9g6U7N@cluster0.bpj2etn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  dbName: "ai_system"
});

const genAI = new GoogleGenerativeAI("AIzaSyDGnqLL1HGfHSBR_DH9vLAz71pI2d2J3BA");
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

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
