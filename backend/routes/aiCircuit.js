import express from "express";
import { upload } from "../middlewares/upload.js";
import { analyzeCircuit } from "../controllers/aiCircuit.js";

const router = express.Router();

router.post(
    "/",
    upload.single("circuitImage"),
    analyzeCircuit
);

export default router;
