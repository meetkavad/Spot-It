const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  type: {
    // {lost , found}
    type: String,
    required: true,
  },
  image: {
    name: String,
    data: Buffer,
    contentType: String,
  },
  item_name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  location: {
    type: String,
    trim: true,
    maxLength: 20,
  },
  description: {
    type: String,
    trim: true,
  },
  comments: [
    {
      username: {
        type: String,
        required: true,
      },
      profile_pic: {
        type: String,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PostModel", PostSchema);
