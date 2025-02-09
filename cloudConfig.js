const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'farm',
      allowedFormats: ["png", "jpg", "jpeg"],
      
    },
  });
   
module.exports = {cloudinary, storage};