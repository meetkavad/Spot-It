const express = require("express");
const chatRouter = express.Router();
const authenticateToken = require("../controllers/authorization.js");

const {
  SearchUser,
  acessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/handleChat.js");

// searching for users :
chatRouter.route("/").get(authenticateToken, SearchUser);

// getting or creating a particular chat :
chatRouter.route("/accessChat").post(authenticateToken, acessChat);

// fetching all chats of a user :
chatRouter.route("/fetchChats").get(authenticateToken, fetchChats);

// creating a group chat :
chatRouter.route("/group").post(authenticateToken, createGroupChat);

// renaming the group :
chatRouter.route("/group/rename").put(authenticateToken, renameGroup);

// renaming the group :
chatRouter.route("/group/rename").put(authenticateToken, addToGroup);

// renaming the group :
chatRouter.route("/group/rename").put(authenticateToken, removeFromGroup);

module.exports = chatRouter;
