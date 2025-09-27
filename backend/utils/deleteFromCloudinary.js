import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteFromCloudinary = async (publicId) => {
  try {
    if(!publicId){
      return null;
    }else{
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary delete result:", result); 
      return result;
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export default deleteFromCloudinary