const PostModel = require("../models/PostModel");
const userModel = require("../models/UserModel");
const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const { io, getReceiverSocketId } = require("../socket/socket.js");

const SearchUser = async (req, res) => {
  const { user } = req.query;
  let filter = {};

  if (user && user !== "") {
    filter = { username: { $regex: user } }; //matches any substring
  }

  const users = await userModel.find(filter).find({
    _id: { $ne: req.user.id },
  });

  res.status(200).json({ users: users });
};

// fetching a conversation:
const accessChat = async (req, res) => {
  try {
    const { userID } = req.params;
    if (!userID) {
      console.log("user-id not sent with request!");
      return res.status(400).send("User ID is required.");
    }

    // Check for existing chat
    let isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userID } } },
      ],
    })
      .populate("users", "-password -notifications")
      .populate("latestMessage");

    // Populate latest message sender details
    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "username",
    });

    // If chat exists, return it
    if (isChat.length > 0) {
      return res.status(201).send({ conversation: isChat[0] });
    }

    // Create new chat if not found
    const chatData = {
      users: [req.user.id, userID],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const fullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password -notifications");

      return res.status(200).send({ newConversation: fullChat });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Error creating chat.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error.");
  }
};

// Mark a chat as read for a user:
const markChatAsRead = async (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.user.id;

  try {
    const chat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $addToSet: { readBy: userId } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    //get receiver Id:
    const receiverId = chat.users
      .filter((user) => user._id.toString() !== req.user.id)
      .map((user) => user._id);

    // socket code:
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("seenChat", {
        chatId: chat._id,
        userId: req.user.id,
      });
    }

    res.status(200).json({ msg: "Chat marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// get unread chat count:
const getUnreadChatCount = async (req, res) => {
  const userId = req.user.id;
  try {
    const unreadChats = await ChatModel.find({
      users: { $elemMatch: { $eq: userId } },
      $and: [
        { readBy: { $exists: true } }, // Chat should have readBy array
        { readBy: { $ne: [] } }, // readBy array is not empty
        { readBy: { $ne: userId } }, // userId is not in readBy array
      ],
    }).countDocuments();

    res.status(200).json({ count: unreadChats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// fetching all chats of a user:
const fetchChats = async (req, res) => {
  try {
    await ChatModel.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password -notifications")
      .populate("groupAdmin", "-password -notifications")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "username email",
        });

        res.status(200).json({ results: results });
      });
  } catch (error) {
    console.log(error.message);
  }
};

const createGroupChat = async (req, res) => {
  const { groupname } = req.body;
  var users = JSON.parse(req.body.users);
  users.push(req.user);

  try {
    const groupChat = await ChatModel.create({
      chatName: groupname,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate("users", "-password", "-notifications")
      .populate("groupAdmin", "-password", "-notifications");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await ChatModel.findOneAndUpdate(
    {
      chatId,
    },
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password", "-notifications")
    .populate("groupAdmin", "-password", "-notifications");

  if (!updatedChat) {
    res.status(404).json({ msg: "chat not found" });
  } else {
    res.status(200).json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { chatID, userID } = req.body;

  const added = await ChatModel.findByIdAndUpdate(
    {
      chatID,
    },
    { $push: { users: userID } },
    { new: true }
  )
    .populate("users", "-password", "-notifications")
    .populate("groupAdmin", "-password", "-notifications");

  if (!added) {
    res.status(404).json({ msg: "chat not found" });
  } else {
    res.status(200).json(added);
  }
};

const removeFromGroup = async (req, res) => {
  const { chatID, userID } = req.body;

  const removed = await ChatModel.findByIdAndDelete(
    {
      chatID,
    },
    { $pull: { users: userID } },
    { new: true }
  )
    .populate("users", "-password", "-notifications")
    .populate("groupAdmin", "-password", "-notifications");

  if (!removed) {
    res.status(404).json({ msg: "chat not found" });
  } else {
    res.status(200).json(removed);
  }
};

module.exports = {
  SearchUser,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  markChatAsRead,
  getUnreadChatCount,
};
