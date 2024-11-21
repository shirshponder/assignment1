import status from "http-status";

const PostModel = require("../models/postsModel");

const getAllPosts = async (req, res) => {
  const filter = req.query.owner;
  try {
    if (filter) {
      const posts = await PostModel.find({ owner: filter });
      res.send(posts);
    } else {
      const posts = await PostModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await PostModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(status.NOT_FOUND).send("Post not found");
    }
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

const createPost = async (req, res) => {
  const postBody = req.body;
  try {
    const post = await PostModel.create(postBody);
    res.status(status.CREATED).send(post);
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
};
