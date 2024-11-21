import status from "http-status";
import postModel from "../models/postsModel.js"; 

export const getAllPosts = async (req, res) => {
  const filter = req.query.owner;
  try {
    if (filter) {
      const posts = await postModel.find({ owner: filter });
      res.send(posts);
    } else {
      const posts = await postModel.find();
      res.send(posts);
    }
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

export const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId);
    if (post) {
      res.send(post);
    } else {
      res.status(status.NOT_FOUND).send("Post not found");
    }
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

export const createPost = async (req, res) => {
  const postBody = req.body;
  try {
    const post = await postModel.create(postBody);
    res.status(status.CREATED).send(post);
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};