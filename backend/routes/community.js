import express from "express";
import { getPosts,createPost,likeToggle,getPost,addComment,postExist,getPostsMen,getPostlogged } from "../controllers/community.js";
import {auth} from '../middlewares/authenticate.js';
const router=express.Router();

router
    .route("/")
    .get(getPosts)

router
    .route("/men")
    .get(auth,getPostsMen)
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
    .route("/:id/logged")
    .get(auth,getPostlogged)
router
    .route("/:id/addComment")   
    .put(auth,addComment)

router
    .route("/check-exist/:value")
    .get(auth,postExist)
export default router;