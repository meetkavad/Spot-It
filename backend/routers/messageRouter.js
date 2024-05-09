const express = require("express");
const messageRouter = express.Router();
const authenticateToken = require("../controllers/authorization.js");

const { sendMessage, allMessages } = require("../controllers/handleMessage.js");

messageRouter.route("/").post(authenticateToken, sendMessage);
messageRouter.route("/:chatID").get(authenticateToken, allMessages);

module.exports = messageRouter;
