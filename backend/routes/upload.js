import express from 'express';
import multer from 'multer';
import storage from '../config/storage.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log("Cloudinary response file object:", req.file);

    return res.status(200).json({ fileUrl: req.file.path }); // or req.file.url if that's what Cloudinary gives
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Server error during upload' });
  }
});
export default router;
