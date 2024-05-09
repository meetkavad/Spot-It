const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "Username address Already exists"],
    required: true,
    minLength: 4,
    maxLength: 30,
    trim: true,
  },
  email: {
    address: {
      type: String,
      unique: [true, "Email address Already exists"],
      trim: true,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    verification_code: {
      type: Number,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  profile_pic: {
    type: String, // url
  },
  notifications: [
    {
      text: {
        type: String,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("UserModel", UserSchema);
