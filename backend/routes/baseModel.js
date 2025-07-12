import express from "express";
import {index,createModel,getModel,deleteModel,getPendingModels,getMyModels,updateModelStatus, editModel, toggleLike, updateViews} from "../controllers/baseModels.js";
import {auth} from '../middlewares/authenticate.js';
import {isAdmin,isOwnerOrAdmin} from '../middlewares/authorize.js';
import multer from 'multer';
const upload = multer();

const router=express.Router();

//baseModels routes
router
    .route("/")
    .get(index)//to show base models
    .post(auth,createModel)//to create a base model

router
    .route("/pending")
    .get(auth,isAdmin,getPendingModels)

router
    .route("/mymodels")
    .get(auth,getMyModels)

router
    .route("/:id")
    .get(getModel)
    .put(auth,isOwnerOrAdmin,upload.none(),editModel)
    .delete(auth,isOwnerOrAdmin,deleteModel)//access to same user, admin

router
    .route("/:id/status")
    .put(auth,isAdmin,updateModelStatus)//access to admin only

router
    .route("/:id/like")
    .put(auth,toggleLike)

router
    .route("/:id/view")
    .put(auth,updateViews)

export default router;