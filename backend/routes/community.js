import express from "express";
import { getPosts,createPost } from "../controllers/community.js";
import {auth} from '../middlewares/authenticate.js';
const router=express.Router();

router
    .route("/")
    .get(getPosts)

router
    .route("/create")
    .post(auth,createPost);
export default router;