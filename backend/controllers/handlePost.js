const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const fs = require("fs");

const CreatePost = async (req, res) => {
  const { type, item_name, location, description } = req.body;
  console.log(req.body);
  // retrieving filename :
  const { originalname, buffer, mimetype } = req.file;

  const imageData = {
    name: originalname,
    data: buffer,
    contentType: mimetype,
  };

  // retrieving userid from jwt to get the username :
  const user = await UserModel.findById(req.user.id);
  const username = user.username;

  // creating post in database :

  try {
    const post = await PostModel.create({
      type: type,
      username: username,
      image: imageData,
      item_name: item_name,
      location: location,
      description: description,
    });

    res.status(200).json({ msg: "post uploaded successfully " });
  } catch (error) {
    console.error(error);
  }
};

const getUserPagePosts = async (req, res) => {
  try {
    // getting whether lost posts or found posts :
    const { type } = req.params;
    const { item } = req.query;
    let filter = { type: type };
    if (item && item !== "") {
      filter = { ...filter, item_name: { $regex: item, $options: "i" } };
    }

    const posts = await PostModel.find(filter);

    // Map over the array of posts to format the response for each post
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const post_id = post._id;
        const imageData = post.image.data;
        const contentType = post.image.contentType;
        const additionalInfo = {
          type: post.type,
          username: post.username,
          item_name: post.item_name,
          location: post.location,
          description: post.description,
          // updatedAt: post.updatedAt,
        };
        return {
          post_id,
          imageData,
          contentType,
          additionalInfo,
        };
      })
    );
    // trying sorting the post on basis of time :

    // formattedPosts.sort(
    //   (a, b) =>
    //     new Date(b.additionalInfo.updatedAt).getTime() -
    //     new Date(a.additionalInfo.updatedAt).getTime()
    // );
    res.status(200).json({
      posts: formattedPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// to get a particular post :
const getPost = async (req, res) => {
  try {
    const { postID } = req.params;
    const post = await PostModel.findById(postID);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(200).json({ post: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postID } = req.params;
    const post = await PostModel.findById(postID);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }

    await PostModel.findByIdAndDelete(postID);

    res.status(200).json({ msg: "post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editPost = async (req, res) => {
  const { postID } = req.params;
  const { type, item_name, location, description } = req.body;
  try {
    const newuser = await PostModel.findOneAndUpdate(
      { _id: postID },
      {
        type: type,
        item_name: item_name,
        location: location,
        description: description,
      },
      { returnOriginal: false }
    );
    res.status(200).json({ msg: "post updated successfully" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  CreatePost,
  getUserPagePosts,
  deletePost,
  getPost,
  editPost,
};
