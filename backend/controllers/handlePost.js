const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const cloudinary = require("../cloudinary");

const CreatePost = async (req, res) => {
  try {
    const { type, item_name, location, description } = req.body;

    let imageUrl = null;
    let imagePublicId = null;
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const username = user.username;

    // Create new post
    const post = await PostModel.create({
      type,
      username,
      image_url: imageUrl, // can be null
      image_public_id: imagePublicId,
      item_name,
      location,
      description,
    });

    res.status(200).json({ msg: "Post uploaded successfully", post });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getUserPagePosts = async (req, res) => {
  try {
    const { type } = req.params;
    const { item, page = 1, limit = 8 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    let filter = { type };
    if (item && item.trim() !== "") {
      filter.item_name = { $regex: item, $options: "i" };
    }

    // Fetch paginated posts
    const posts = await PostModel.find(filter)
      .sort({ date: -1, _id: -1 }) // Sort by date and then by ID
      .skip(skip)
      .limit(limitNum);

    const totalPosts = await PostModel.countDocuments(filter);

    // Format posts
    const formattedPosts = posts.map((post) => {
      const post_id = post._id;
      const additionalInfo = {
        type: post.type,
        username: post.username,
        item_name: post.item_name,
        location: post.location,
        description: post.description,
        date: post.date,
      };

      return {
        post_id,
        image_url: post.image_url,
        additionalInfo,
      };
    });

    res.status(200).json({
      posts: formattedPosts,
      totalPosts: totalPosts,
      totalPages: Math.ceil(totalPosts / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// to get a particular post:
const getPost = async (req, res) => {
  try {
    const { postID } = req.params;
    const post = await PostModel.findById(postID);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    res.status(200).json({ post: post });
  } catch (error) {
    console.log(error.message);
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

    // If the post has a Cloudinary image, delete it
    if (post.image_public_id) {
      await cloudinary.uploader.destroy(post.image_public_id);
    }

    await PostModel.findByIdAndDelete(postID);

    res.status(200).json({ msg: "post deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editPost = async (req, res) => {
  const { postID } = req.params;
  const { type, item_name, location, description } = req.body;
  try {
    const post = await PostModel.findById(postID);
    if (!post) {
      return res.status(404).json({ msg: "post not found" });
    }
    const updateData = { type, item_name, location, description };

    if (req.file) {
      // Delete old image from Cloudinary
      if (post.image_public_id) {
        await cloudinary.uploader.destroy(post.image_public_id);
      }
      // Update image details
      updateData.image_url = req.file.path;
      updateData.image_public_id = req.file.filename;
    }

    await PostModel.findByIdAndUpdate(postID, updateData, { new: true });
    res.status(200).json({ msg: "post updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  CreatePost,
  getUserPagePosts,
  deletePost,
  getPost,
  editPost,
};
