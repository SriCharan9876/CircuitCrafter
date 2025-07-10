import express from "express";
import { auth } from "../middlewares/authenticate.js";
import {uploadBaseFile,generateUserFile, uploadProfilePic, uploadModelPreviewImg, uploadCategoryImage} from "../controllers/files.js";
import multer from 'multer';
import storage from '../config/BaseModel_storage.js';

const upload = multer({ storage });
const router = express.Router();

router.post("/basefile", auth, upload.single("file"), uploadBaseFile);
router.post("/profile", upload.single("file"), uploadProfilePic);
router.post("/baseimg", upload.single("file"), uploadModelPreviewImg);
router.post("/userfile", auth, generateUserFile);
router.post("/category", upload.single("file"), uploadCategoryImage);

export default router;
