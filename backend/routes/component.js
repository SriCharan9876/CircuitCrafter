import express from "express";
import {index,createComponent,deleteComponent,allComponents} from "../controllers/component.js";
import {auth} from '../middlewares/authenticate.js';
import {isAdmin,isOwnerOrAdmin} from '../middlewares/authorize.js';

const router=express.Router();

//component routes
router
    .route("/")
    .get(index)
    .post(auth,createComponent)

router
    .route("/all")
    .get(auth,isAdmin,allComponents)

router
    .route("/:id")
    .delete(auth,isOwnerOrAdmin,deleteComponent)

export default router;