import express from "express";
import {signup, login,getmydata, googleLogin,getFavModels, saveModel,sendOtp,deleteNotification,verifyOtp,postNotifications,getNotifications,postNotificationsAllUsers,checkExist,getAdminIds} from "../controllers/auth.js";
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
    .route("/admins")
    .get(auth,getAdminIds)

router
    .route("/favModels")
    .get(auth,getFavModels)

router
    .route("/save")
    .put(auth,saveModel)

router
    .route("/send-otp")
    .post(sendOtp)

router
    .route("/verify-otp")
    .post(verifyOtp)

router
    .route("/notifications")
    .post(auth,postNotificationsAllUsers)
    .get(auth,getNotifications)
    .put(auth,deleteNotification)

router
    .route("/check-exist/:value")
    .get(auth,checkExist)
export default router;