import express from "express";
import {index, createCategory} from "../controllers/categories.js"; // <-- adjust if needed
import {auth} from '../middlewares/authenticate.js';
import {isAdmin} from '../middlewares/authorize.js';
const router=express.Router();
//Categories routes
router
    .route("/")
    .get(index)
    .post(auth,isAdmin,createCategory)

export default router;