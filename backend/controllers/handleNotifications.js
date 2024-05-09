const PostModel = require("../models/PostModel");
const userModel = require("../models/UserModel");

const getNotifications = async (req, res) => {
  const user = await userModel.findById(req.user.id);

  if (user.notifications.length !== 0) {
    res.status(200).json({ notifications: user.notifications });
  } else {
    res.status(200).json({ msg: "no notifications" });
  }
};

module.exports = { getNotifications };
