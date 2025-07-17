const express = require("express");
const userRouter = express.Router();
const {
  uploadPostImage,
  uploadProfilePic,
} = require("../components/imageUploader.js");

const authenticateToken = require("../controllers/authorization.js");

// playing with posts :
const {
  CreatePost,
  getUserPagePosts,
  deletePost,
  getPost,
  editPost,
} = require("../controllers/handlePost.js");

userRouter
  .route("/createPost")
  .post(authenticateToken, uploadPostImage.single("image"), CreatePost);
userRouter
  .route("/:postID/editPost")
  .patch(authenticateToken, uploadPostImage.single("image"), editPost);

userRouter.route("/userPage/:type").get(authenticateToken, getUserPagePosts);
userRouter.route("/:postID/getPost").get(authenticateToken, getPost);
userRouter.route("/:postID/deletePost").delete(authenticateToken, deletePost);

// play with comments:
const {
  createComment,
  getComments,
  deleteComment,
  editComment,
} = require("../controllers/handleComment.js");

userRouter
  .route("/:postID/createComment")
  .post(authenticateToken, createComment);
userRouter.route("/:postID/comments").get(authenticateToken, getComments);
userRouter
  .route("/:postID/:commentID/deleteComment")
  .delete(authenticateToken, deleteComment);
userRouter
  .route("/:postID/:commentID/editComment")
  .patch(authenticateToken, editComment);

// accessing user profile :
const {
  getProfile,
  updateProfile,
} = require("../controllers/handleProfile.js");
userRouter
  .route("/userProfile")
  .get(authenticateToken, getProfile)
  .patch(authenticateToken, uploadProfilePic.single("image"), updateProfile);

// notifications handling :
const { getNotifications } = require("../controllers/handleNotifications.js");
userRouter.route("/notifications").get(authenticateToken, getNotifications);

module.exports = userRouter;
