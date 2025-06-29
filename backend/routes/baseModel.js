import express from "express";
import {index,createModel,getModel,deleteModel,getPendingModels,getMyModels,approveModel} from "../controllers/baseModels.js";
import auth from '../auth.js';

const router=express.Router();

//baseModels routes
router
    .route("/")
    .get(index)//to show base models
    .post(auth,createModel)//to create a base model

router
    .route("/pending")
    .get(getPendingModels)

router
    .route("/mymodels")
    .get(getMyModels)

router
    .route("/:id")
    .get(getModel)
    .delete(auth,deleteModel)//access to same user, admin

router
    .route("/:id/pending")
    .put(approveModel)//access to admin only

export default router;