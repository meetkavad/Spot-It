const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

// For Post Images
const postImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "spotit_uploads/post_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// For Profile Pictures
const profilePicStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "spotit_uploads/profile_pics",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadPostImage = multer({ storage: postImageStorage });
const uploadProfilePic = multer({ storage: profilePicStorage });

module.exports = {
  uploadPostImage,
  uploadProfilePic,
};
