import express from "express";
import {index, createCategory} from "../controllers/categories.js"; // <-- adjust if needed
const router=express.Router();

//Categories routes
router
    .route("/")
    .get(index)
    .post(createCategory)

export default router;