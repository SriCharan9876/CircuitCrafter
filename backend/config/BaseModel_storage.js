import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.js';
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'CircuitCrafter',
    resource_type: 'raw',
    // public_id: (req, file) => {
    //   const { name } = path.parse(file.originalname); // remove `.ext`
    //   return name; // ✅ keeps it as `inv_amp`, Cloudinary handles `.asc`
    // },
    // format: async (req, file) => 'asc', // 👈 explicitly tag it as .asc if you want
  },
});

export default storage;
