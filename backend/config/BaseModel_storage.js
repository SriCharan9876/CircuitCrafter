import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'CircuitCrafter',
      resource_type: 'raw',       // Allow non-image files
      use_filename: true,         // Use a filename we define below
      unique_filename: false,     // Don't append random characters
      public_id:(file.originalname)
    };
  },
});

export default storage;
