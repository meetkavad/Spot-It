const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const UserModel = require("../models/UserModel");
const { io, getReceiverSocketId } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
  const { chatID } = req.params;
  const { content, replyTo } = req.body;

  if (!content || !chatID) {
    console.log("Invalid chat ");
    res.status(404).json({ msg: "chat not found" });
  }

  var messageObj = {
    sender: req.user.id,
    content: content,
    chat: chatID,
    replyTo: replyTo ? replyTo : null,
  };

  try {
    const newMessage = await MessageModel.create(messageObj);

    // update the old message's toReply field, if the message is a reply to another message:
    if (replyTo) {
      const oldMessage = await MessageModel.findOne({ _id: replyTo });
      if (oldMessage) {
        oldMessage.toReply = newMessage._id;
        await oldMessage.save();
      }
    }

    var message = await MessageModel.findOne({
      _id: newMessage._id,
    })
      .populate("sender", "username")
      .populate("chat")
      .populate("replyTo", "content");

    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "username",
    });

    // update the latest message in the chat + mark it as read by the sender:
    await ChatModel.findByIdAndUpdate(chatID, {
      latestMessage: message._id,
      $set: { readBy: [req.user.id] },
    });

    //get receiver Id:
    const receiverId = message.chat.users
      .filter((user) => user._id.toString() !== req.user.id)
      .map((user) => user._id);

    // socket code:
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(200).json({ message: message });
  } catch (error) {
    console.log(error.message);
  }
};

const allMessages = async (req, res) => {
  const { chatID } = req.params;

  if (!chatID) {
    res.status(404).json({ msg: "chat not found " });
  }

  var messages = await MessageModel.find({ chat: chatID })
    .populate("sender", "username")
    .populate("chat")
    .populate("replyTo", "content");

  messages = await UserModel.populate(messages, {
    path: "chat.users",
    select: "username",
  });

  res.status(200).json({ messages: messages });
};

const editMessage = async (req, res) => {
  const { chatID, messageID } = req.params;
  const content = req.body.message;

  if (!content || !chatID || !messageID) {
    console.log("Invalid chat ");
    res.status(404).json({ msg: "chat not found" });
  }

  try {
    var editedMessage = await MessageModel.findOneAndUpdate(
      { _id: messageID },
      { content: content },
      { new: true }
    );

    editedMessage = await MessageModel.findOne({
      _id: editedMessage._id,
    })
      .populate("sender", "username")
      .populate("chat");

    //get receiver Id:
    const receiverId = editedMessage.chat.users
      .filter((user) => user._id.toString() !== req.user.id)
      .map((user) => user._id);

    // socket code:
    const receiverSocketId = getReceiverSocketId(receiverId);

    console.log(receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newEditedMessage", editedMessage);
    }

    res.status(200).json({ message: editedMessage });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteMessage = async (req, res) => {
  const { chatID, messageID } = req.params;

  if (!chatID || !messageID) {
    res.status(404).json({ msg: "chat not found" });
  }

  try {
    // get the latest message first:
    const chat = await ChatModel.findOne({ _id: chatID });

    // delete the dependency of the message ie. replyTo and toReply:
    const message = await MessageModel.findOne({ _id: messageID });

    // if the message is a reply to another message, then update the old message's toReply field:
    if (message.replyTo) {
      const oldMessage = await MessageModel.findOne({ _id: message.replyTo });
      if (oldMessage) {
        oldMessage.toReply = null;
        await oldMessage.save();
      }
    }

    // if the message has a reply message, then update the reply message's replyTo field:
    if (message.toReply) {
      const replyMessage = await MessageModel.findOne({
        _id: message.toReply,
      });
      if (replyMessage) {
        replyMessage.replyTo = null;
        await replyMessage.save();
      }
    }

    // delete the message:
    const deletedMessage = await MessageModel.findOneAndDelete({
      _id: messageID,
    });

    const latestMessage = chat.latestMessage;

    // if so update the latest message in the chat:
    if (latestMessage.toString() === messageID.toString()) {
      const newLatestMessage = await MessageModel.findOne({
        chat: chatID,
      }).sort({
        createdAt: -1,
      });
      await ChatModel.findByIdAndUpdate(chatID, {
        latestMessage: newLatestMessage?._id || null,
      });
    }

    //get receiver Id:
    const receiverId = chat.users
      .filter((user) => user._id.toString() !== req.user.id)
      .map((user) => user._id);

    // socket code:
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deleteMessage", deletedMessage);
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMessage, allMessages, editMessage, deleteMessage };
