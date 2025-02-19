const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_api,
  api_secret: process.env.cloudinary_secret,
});

module.exports = cloudinary;
