const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");
const { io, getReceiverSocketId } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
  const { chatID } = req.params;
  const content = req.body.message;

  if (!content || !chatID) {
    console.log("Invalid chat ");
    res.status(404).json({ msg: "chat not found" });
  }

  var messageObj = {
    sender: req.user.id,
    content: content,
    chat: chatID,
  };

  try {
    const newMessage = await MessageModel.create(messageObj);

    var message = await MessageModel.findOne({
      _id: newMessage._id,
    })
      .populate("sender", "username")
      .populate("chat");

    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "username",
    });

    await ChatModel.findByIdAndUpdate(chatID, {
      latestMessage: message,
    });

    //get receiver Id:
    const receiverId = message.chat.users
      .filter((user) => user._id.toString() !== req.user.id)
      .map((user) => user._id);

    // socket code:
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageObj);
    }

    res.status(200).json({ message: message });
  } catch (error) {
    console.error(error);
  }
};

const allMessages = async (req, res) => {
  const { chatID } = req.params;

  if (!chatID) {
    res.status(404).json({ msg: "chat not found " });
  }

  var messages = await MessageModel.find({ chat: chatID })
    .populate("sender", "username")
    .populate("chat");

  messages = await UserModel.populate(messages, {
    path: "chat.users",
    select: "username",
  });

  res.status(200).json({ messages: messages });
};

module.exports = { sendMessage, allMessages };
