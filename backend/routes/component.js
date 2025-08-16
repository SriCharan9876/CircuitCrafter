import express from "express";
import {index,createComponent,deleteComponent,allComponents} from "../controllers/component.js";
import {auth} from '../middlewares/authenticate.js';

const router=express.Router();

//component routes
router
    .route("/")
    .get(index)
    .post(auth,createComponent)

router
    .route("/all")
    .get(allComponents)

router
    .route("/:compId")
    .delete(auth,deleteComponent)

export default router;