const cloudinary = require("cloudinary").v2;

const {
  cloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} = require("../Config/config");

cloudinary.config({
  cloud_name: cloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

const uploadImages = (images) => {
  return Promise.all(
    images.map((base64Image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(base64Image, (error, result) => {
          if (error) {
            console.error(`Error uploading image:`, error);
            reject(error);
          } else {
            console.log(`Image uploaded successfully:`, result.secure_url);
            resolve(result.secure_url);
          }
        });
      });
    })
  );
};

module.exports = { uploadImages };
