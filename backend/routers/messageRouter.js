const express = require("express");
const messageRouter = express.Router();
const authenticateToken = require("../controllers/authorization.js");

const {
  sendMessage,
  allMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/handleMessage.js");

messageRouter
  .route("/:chatID")
  .get(authenticateToken, allMessages)
  .post(authenticateToken, sendMessage);

messageRouter
  .route("/:chatID/:messageID")
  .patch(authenticateToken, editMessage)
  .delete(authenticateToken, deleteMessage);

module.exports = messageRouter;
