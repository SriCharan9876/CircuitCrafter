import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.js';
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'CircuitCrafter',
  },
});

export default storage;
