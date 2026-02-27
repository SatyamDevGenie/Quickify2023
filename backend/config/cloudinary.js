import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  ? process.env.CLOUDINARY_CLOUD_NAME.trim()
  : undefined;
const apiKey = process.env.CLOUDINARY_API_KEY
  ? process.env.CLOUDINARY_API_KEY.trim()
  : undefined;
const apiSecret = process.env.CLOUDINARY_API_SECRET
  ? process.env.CLOUDINARY_API_SECRET.trim()
  : undefined;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
