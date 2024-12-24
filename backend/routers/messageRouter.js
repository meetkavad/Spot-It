const express = require("express");
const messageRouter = express.Router();
const authenticateToken = require("../controllers/authorization.js");

const { sendMessage, allMessages } = require("../controllers/handleMessage.js");

messageRouter
  .route("/:chatID")
  .get(authenticateToken, allMessages)
  .post(authenticateToken, sendMessage);

module.exports = messageRouter;
