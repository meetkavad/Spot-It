const PostModel = require("../models/PostModel");
const userModel = require("../models/UserModel");

const createComment = async (req, res) => {
  const { comment } = req.body;
  const postID = req.params.postID;

  const post = await PostModel.findById(postID);
  if (post) {
    const user = await userModel.findById(req.user.id);
    const newComment = {
      username: user.username,
      profile_pic: user.profile_pic,
      text: comment,
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json({ msg: "comment created" });
  } else {
    res.status(404).json({ msg: "post not found" });
  }
};

const getComments = async (req, res) => {
  const postID = req.params.postID;
  const post = await PostModel.findById(postID);
  if (post) {
    res.status(200).json({ comments: post.comments });
  } else {
    res.status(404).json({ msg: "post not found" });
  }
};

const deleteComment = async (req, res) => {
  const postID = req.params.postID;
  const commentID = req.params.commentID;
  const post = await PostModel.findById(postID);
  if (post) {
    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentID
    );
    await post.save();
    res.status(200).json({ msg: "comment deleted" });
  } else {
    res.status(404).json({ msg: "post not found" });
  }
};
const editComment = async (req, res) => {};

module.exports = {
  createComment,
  getComments,
  deleteComment,
  editComment,
};
