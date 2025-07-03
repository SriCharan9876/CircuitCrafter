import express from "express";
import {signup, login,getmydata} from "../controllers/auth.js";
const router=express.Router();
import {auth} from '../middlewares/authenticate.js';

//Categories routes
router
    .route("/signup")
    .post(signup)

router
    .route("/login")
    .post(login)

router
    .route("/me")
    .get(auth,getmydata)

export default router;