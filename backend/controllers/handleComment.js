const PostModel = require("../models/PostModel");
const userModel = require("../models/UserModel");

const createComment = async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ msg: "comment is required" });
  }

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

    // send notification to post owner :
    const postOwner = await userModel.findOne({ username: post.username });
    if (postOwner.username !== user.username) {
      const newNotification = {
        text: `${user.username} commented on your post`,
      };
      postOwner.notifications.push(newNotification);
      await postOwner.save();
      console.log("notification sent");
    }

    res.status(201).json({ msg: "comment created" });
  } else {
    res.status(404).json({ msg: "post not found" });
  }
};

const getComments = async (req, res) => {
  const postID = req.params.postID;
  const post = await PostModel.findById(postID);
  if (post) {
    // sorted in descending order:
    post.comments.sort((a, b) => b.timestamp - a.timestamp);
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
