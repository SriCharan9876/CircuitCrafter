import modifyLtspiceFileFromCloud from '../modelfiles/generalised.js';
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";

export const uploadBaseFile=async(req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    return res.status(200).json({ fileUrl: req.file.path }); // or req.file.url if that's what Cloudinary gives
  } catch (err) {
    console.error('Upload error:', err);
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