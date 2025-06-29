import express from "express";
import {signup, login,getmydata} from "../controllers/auth.js";
const router=express.Router();

//Categories routes
router
    .route("/signup")
    .post(signup)

router
    .route("/login")
    .post(login)

router
    .route("/me")
    .get(getmydata)

export default router;