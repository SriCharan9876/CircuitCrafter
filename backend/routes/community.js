import express from "express";
import { getPosts,createPost,likeToggle,getPost,addComment } from "../controllers/community.js";
import {auth} from '../middlewares/authenticate.js';
const router=express.Router();

router
    .route("/")
    .get(getPosts)

router
    .route("/create")
    .post(auth,createPost);

router 
    .route("/:id/like")
    .put(auth,likeToggle);

router
    .route("/:id")
    .get(getPost);

router
    .route("/:id/addComment")   
    .put(auth,addComment)
export default router;