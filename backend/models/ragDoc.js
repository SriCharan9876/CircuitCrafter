import mongoose from "mongoose";
import { aiDB } from "../config/db.js";

const ragDocSchema = new mongoose.Schema({
  text: String,
  embedding: [Number]
});

export default aiDB.model("RagDoc", ragDocSchema, "knowledge_base");
