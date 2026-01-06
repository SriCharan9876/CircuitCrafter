import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const mainDB = mongoose.createConnection(process.env.ATLASDB_URL, {
  dbName: "test"              // Your existing website DB
});

export const aiDB = mongoose.createConnection(process.env.ATLASDB_URL, {
  dbName: "ai_system"         // AI brain DB
});

mainDB.once("open", () => console.log("Main DB connected"));
aiDB.once("open", () => console.log("AI DB connected"));
