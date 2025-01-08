import status from 'http-status';
import { Request, Response } from 'express';
import postModel from '../models/postsModel';

export const getPosts = async (req: Request, res: Response) => {
  const senderId = req.query.sender;

  try {
    const posts = senderId && (await postModel.find({ sender: senderId }));
    res.status(status.OK).send(posts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const getPostById = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    const post = await postModel.findById(postId);
    if (post) {
      res.status(status.OK).send(post);
    } else {
      res.status(status.NOT_FOUND).send('Post not found');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const createPost = async (req: Request, res: Response) => {
  const postBody = req.body;

  try {
    const post = await postModel.create(postBody);
    res.status(status.CREATED).send(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const updatePostById = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const postBody = req.body;

  try {
    const post = await postModel.findByIdAndUpdate({ _id: postId }, postBody, {
      returnDocument: 'after',
    });
    if (post) {
      res.status(status.OK).send(post);
    } else {
      res.status(status.NOT_FOUND).send('Post not found');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};
