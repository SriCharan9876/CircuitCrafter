import mongoose from "mongoose";
import { aiDB } from "../config/db.js";

const aiChatSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  role: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default aiDB.model("AIChat", aiChatSchema, "ai_chats");
