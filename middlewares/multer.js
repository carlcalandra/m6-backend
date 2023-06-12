import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      let path;
      const { id } = req.params;
      path = id ? `/m6/${req.baseUrl}/${id}` : `/m6/${req.baseUrl}`
      return path
    },
    allowed_formtas: ".jpg, .jpeg, .png",
  },
});

const parser = multer({ storage: storage });

export default parser;
