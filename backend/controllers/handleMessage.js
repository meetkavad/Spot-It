const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");

const sendMessage = async (req, res) => {
  const { chatID, content } = req.body;
  if (!content || !chatID) {
    console.log("Invalid chat ");
    res.status(404).json({ msg: "chat not found" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatID,
  };

  try {
    var message = await MessageModel.create(newMessage)
      .populate("sender", "username")
      .populate("chat");

    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "username",
    });
  } catch (error) {
    console.error(error);
  }

  await ChatModel.findByIdAndUpdate(chatID, {
    latestMessage: message,
  });
  res.status(200).json(message);
};

const allMessages = async (req, res) => {
  const { chatID } = req.params;

  if (!chatID) {
    res.status(404).json({ msg: "chat not found " });
  }
  const chat = await MessageModel.findOne(chatID)
    .populate("sender", "username")
    .populate("chat");

  res.status(200).json(chat);
};

module.exports = { sendMessage, allMessages };
