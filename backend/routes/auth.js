import express from "express";
import {signup, login,getmydata, googleLogin,getFavModels, saveModel} from "../controllers/auth.js";
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
    .route("/google-login")
    .post(googleLogin)

router
    .route("/me")
    .get(auth,getmydata)

router
    .route("/favModels")
    .get(auth,getFavModels)

router
    .route("/save")
    .put(auth,saveModel)

export default router;