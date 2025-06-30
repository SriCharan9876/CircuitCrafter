import express from "express";
import {index, createCategory} from "../controllers/categories.js"; // <-- adjust if needed
import auth from '../auth.js';

const router=express.Router();
//Categories routes
router
    .route("/")
    .get(index)
    .post(auth,createCategory)

export default router;