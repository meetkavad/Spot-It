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
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
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
  gender: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  location: {
    type: String,
  },
  hobbies: [
    {
      type: String,
    },
  ],
  bio: {
    type: String,
    maxLength: 500,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("UserModel", UserSchema);
