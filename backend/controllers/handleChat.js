const PostModel = require("../models/PostModel");
const userModel = require("../models/UserModel");
const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");

const SearchUser = async (req, res) => {
  const { user } = req.query;
  let filter = {};

  if (user && user !== "") {
    filter = { username: { $regex: user } };
  }

  const users = await userModel.find(filter).find({
    _id: { $ne: req.user.id },
  });
  res.status(200).json({ users: users });
};

// getting or creating a particular chat :
const acessChat = async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    console.log("user-id not sent with request!");
    return res.status(400);
  }

  var isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password", "-notifications")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "username",
  });

  // sending chat if exists else creating it :

  if (isChat.length > 0) {
    res.status(201).send(isChat[0]);
  } else {
    var chatData = {
      users: [req.user._id, userID],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const fullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password", "-notifications");

      res.status(200).send(fullChat);
    } catch (error) {
      console.error(error);
    }
  }
};

// fetching all chats of a user :
const fetchChats = async (req, res) => {
  try {
    ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password", "-notifications")
      .populate("groupAdmin", "-password", "-notifications")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await userModel.populate(results, {
          path: "latestMessage.sender",
          select: "username email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
  acessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
