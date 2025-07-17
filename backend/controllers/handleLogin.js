const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt"); // for hashing codes
const jwt = require("jsonwebtoken");
const transporter = require("../components/transporter");
const generateCode = require("../components/code_generator");
require("dotenv").config();

// user login :
const PostUserLogin = async (req, res) => {
  const { username, password } = req.body;

  //checking for user in database :
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(404).json({
      msg: "User not found",
    });
  } else {
    //comparing the password :
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      //creating json web token :
      const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      user.password = undefined;

      res.status(200).json({
        msg: "login successful",
        token: jwt_token,
        userData: user,
      });
    } else {
      res.status(401).json({
        msg: "Invalid credentials",
      });
    }
  }
};

// forgot password :
const PostForgotPassword = async (req, res) => {
  const { email } = req.body;

  //checking for user in database :
  const user = await UserModel.findOne({ "email.address": email });

  if (!user) {
    return res.status(404).json({
      msg: "No user with this email address is found!!",
    });
  } else {
    //generating code :
    const code = generateCode();
    console.log(code);
    user.email.verification_code = code;
    await user.save();

    //creating json web token :
    const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // sending email :
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Forgot Password",
      text: `Your verification code is ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          msg: "Internal server error",
        });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          msg: "Verification code sent to your email",
          token: jwt_token,
        });
      }
    });
  }
};

// reset password :
const PostResetPassword = async (req, res) => {
  const { password } = req.body;
  const user_id = req.user.id;
  const user = await UserModel.findById(user_id);

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  await user.save();

  res.status(200).json({
    msg: "Password reset successful",
  });
};

module.exports = { PostUserLogin, PostForgotPassword, PostResetPassword };
