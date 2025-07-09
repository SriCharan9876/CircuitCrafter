import modifyLtspiceFileFromCloud from '../modelfiles/generalised.js';
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";

export const uploadBaseFile=async(req, res) => {
  try {
    console.log("REQ.FILE", req.file);
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    return res.status(200).json({ fileUrl: req.file.path }); // or req.file.url if that's what Cloudinary gives
  } catch (err) {
    console.error("Upload error:");
    console.dir(err, { depth: null });
    return res.status(500).json({ error: 'Server error during upload' });
  }
};

export const generateUserFile=async (req, res) => {
    const { pmodel,inputValues,calc2,relations } = req.body;
    const inputFile = pmodel.fileUrl;

    //Deleting current userspicefile if exists
    const user = await User.findById(req.user.userId);
    if (user.generatedFile?.public_id) {
        try {
            await cloudinary.uploader.destroy(user.generatedFile.public_id, {
            resource_type: "raw",
            });
        } catch (err) {
            console.warn("Failed to delete previous file:", err.message);
        }
    }

    try {
        const {cloudinaryUrl,public_id,values}=await modifyLtspiceFileFromCloud(inputFile, inputValues, calc2, relations);
        user.generatedFile = {
            public_id,
            url: cloudinaryUrl,
            baseModelId: pmodel._id
        };
        await user.save();
        res.json({ success: true, message: "Circuit generated successfully." ,cloudinaryUrl,values});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Failed to generate circuit." });
    }
}

export const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "profile_pics"
        });
        return res.status(200).json({
            public_id: result.public_id,
            url: result.secure_url
        });

    } catch (err) {
        console.error("Profile upload error:", err);
        return res.status(500).json({ message: "Upload failed" });
    }
};

export const uploadModelPreviewImg = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "model_pics"
        });
        return res.status(200).json({
            public_id: result.public_id,
            url: result.secure_url
        });

    } catch (err) {
        console.error("Base model preview image upload error:", err);
        return res.status(500).json({ message: "Upload failed" });
    }
};