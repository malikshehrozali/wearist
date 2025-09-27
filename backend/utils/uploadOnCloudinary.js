import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (file) => {
  try {
    if(!file){
      return null;
    }else{
      const result = await cloudinary.uploader.upload(file, { resource_type: 'auto' });
      console.log("Cloudinary upload result:", result); 
      fs.unlinkSync(file);  
      return result;
    }
  } catch (error) {
    console.log(error.message);
    fs.unlinkSync(file);
    return null;
  }
};

export default uploadOnCloudinary