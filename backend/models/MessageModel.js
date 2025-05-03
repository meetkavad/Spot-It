const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    content: {
      type: String,
      trim: true,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    toReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatModel",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MessageModel", MessageSchema);
