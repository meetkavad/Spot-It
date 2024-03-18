const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt"); // for hashing password
const jwt = require("jsonwebtoken");
const transporter = require("../components/transporter");
const generateCode = require("../components/code_generator");
require("dotenv").config();

// for availability of username :
const checkUsername = async (req, res) => {
  const { username } = req.body;

  // checking if username contains spaces :
  if (username.includes(" ")) {
    return res.status(409).json({
      msg: "invalid username",
      color: "red",
    });
  }

  //checking for existing user :
  const existingUser = await UserModel.findOne({
    username,
  });

  //sending response based on availablity of username :
  if (existingUser || username.includes(" ")) {
    return res.status(409).json({
      msg: "username not available",
      color: "red",
    });
  } else {
    return res.status(200).json({
      msg: "username available",
      color: "green",
    });
  }
};

// Signing Up :
const PostUserSignup = async (req, res) => {
  const { username, email, password } = req.body;

  //checking for the user in database , if it already exists :
  const existingUser = await UserModel.findOne({
    "email.address": email,
  });

  if (existingUser) {
    return res.status(409).json({
      msg: "Account already exists",
    });
  }

  //Hashing password :
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  //creating user in database :
  try {
    const user = await UserModel.create({
      username: username,
      "email.address": email,
      password: hashedPassword,
    });

    console.log("user created");

    //creating json web token :
    const jwt_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // generating code for email verification :
    const email_code = generateCode();
    // console.log(email_code);
    user.email.verification_code = email_code;
    await user.save();

    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Spot-It Email Verification",
      html: ` <div class="container">
                <h1>Spot-It Email Verification</h1>
                <p>Hello Spot-It User,</p>
                <p>Below is your code for Email verification : </p>
                <p>${email_code}</p>
                <p>If you didn't request email Authentication, feel free to ignore this email.</p>
                <div class="footer">
                    <p>All Rights Reserved @Spot-It_2024</p>
                </div> `,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        // Attempt to delete the user :
        await UserModel.findOneAndDelete({
          "email.address": email, // email : {address : email} didn't worked here...
        });
        console.log("user deleted!!");

        return res.status(500).json({
          error: "Email could not be sent , Provide a valid email address!",
        });
      }
      //Final Response on success :
      res.json({
        message: "Email sent for verification",
        jwt_token: jwt_token,
        userData: user,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// email verification :
const PostEmailVerification = async (req, res) => {
  let { email_code } = req.body;
  email_code = Number(email_code);

  //getting user from jwt_token :
  const user_id = req.user.id;
  console.log(user_id);

  //checking for the user in database :
  user = await UserModel.findById(user_id);

  // comparing email_code :`
  if (email_code === user.email.verification_code) {
    user.email.is_verified = true;
    await user.save();
    res.status(200).json({
      msg: "Email Verified",
    });
  } else {
    console.log(email_code);
    console.log(user.email.verification_code);
    // Attempt to delete the user :
    await UserModel.deleteOne({ _id: user_id });
    console.log("user deleted!!");

    res.status(400).json({
      msg: "Invalid Code",
    });
  }
};

module.exports = { PostUserSignup, checkUsername, PostEmailVerification };
