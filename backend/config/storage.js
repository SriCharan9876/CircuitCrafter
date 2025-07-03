import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.js';
import path from "path"
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'CircuitCrafter',
    resource_type: 'raw',
    public_id: (req, file) => {
      const { name, ext } = path.parse(file.originalname);
      return `${name}${ext}`; // 👈 This ensures ".asc" is part of the public ID
    },
  },
});

export default storage;
