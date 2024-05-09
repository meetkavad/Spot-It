const mongoose = require("mongoose");
// const UserModel = require("./UserModel");
// const MessageModel = require("./MessageModel");

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      default: "friend",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatModel", ChatSchema);
