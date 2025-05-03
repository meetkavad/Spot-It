const express = require("express");
const chatRouter = express.Router();
const authenticateToken = require("../controllers/authorization.js");

const {
  SearchUser,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  markChatAsRead,
  getUnreadChatCount,
} = require("../controllers/handleChat.js");

// searching for users :
chatRouter.route("/").get(authenticateToken, SearchUser);

// getting or creating a particular chat :
chatRouter.route("/accessChat/:userID").get(authenticateToken, accessChat);

// fetching all chats of a user :
chatRouter.route("/fetchChats").get(authenticateToken, fetchChats);

//marking a chat as read:
chatRouter
  .route("/markAsRead/:chatId")
  .patch(authenticateToken, markChatAsRead);

// getting unread chat count:
chatRouter.route("/unreadCount").get(authenticateToken, getUnreadChatCount);

// creating a group chat :
chatRouter.route("/group").post(authenticateToken, createGroupChat);

// renaming the group :
chatRouter.route("/group/rename").put(authenticateToken, renameGroup);

// renaming the group :
chatRouter.route("/group/rename").put(authenticateToken, addToGroup);

// renaming the group :
chatRouter.route("/group/rename").put(authenticateToken, removeFromGroup);

module.exports = chatRouter;
