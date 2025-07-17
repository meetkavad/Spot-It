const userModel = require("../models/UserModel");
const postModel = require("../models/PostModel");
const cloudinary = require("../cloudinary");

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error.message);
  }
};

// to upload profile picture
const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (req.file) {
      // Delete old image from Cloudinary
      if (user.profile_pic.public_id) {
        await cloudinary.uploader.destroy(user.profile_pic.public_id);
      }
      user.profile_pic.url = req.file.path;
      user.profile_pic.public_id = req.file.filename;
    }

    await user.save();
    res.status(200).json({
      msg: "Profile updated successfully",
      profile_pic: user.profile_pic,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };
