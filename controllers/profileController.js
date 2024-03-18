const userModel = require("../models/UserModel");
const postModel = require("../models/PostModel");

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { getProfile };
