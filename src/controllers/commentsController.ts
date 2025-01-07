import status from 'http-status';
import { Request, Response } from 'express';
import commentsModel from '../models/commentsModel';
import postModel from '../models/postsModel';

export const createComment = async (req: Request, res: Response) => {
  const commentBody = req.body;

  try {
    const comment = await commentsModel.create(commentBody);
    res.status(status.CREATED).send(comment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const updateCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;
  const commentBody = req.body;

  try {
    const comment = await commentsModel.findByIdAndUpdate(
      { _id: commentId },
      commentBody,
      {
        returnDocument: 'after',
      }
    );
    if (comment) {
      res.status(status.OK).send(comment);
    } else {
      res.status(status.NOT_FOUND).send('Comment not found');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;

  try {
    const comment = await commentsModel.findById(commentId);
    if (comment) {
      res.status(status.OK).send(comment);
    } else {
      res.status(status.NOT_FOUND).send('Comment not found');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const deleteCommentById = async (req: Request, res: Response) => {
  const commentId = req.params.id;

  try {
    const comment = await commentsModel.findByIdAndDelete(
      { _id: commentId },
      {
        returnDocument: 'after',
      }
    );

    if (comment) {
      res.status(status.OK).send(comment);
    } else {
      res.status(status.NOT_FOUND).send('Comment not found');
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.query.postId;

    if (postId) {
      const post = await postModel.findById(postId);
      if (post) {
        const comments = await commentsModel.find({ postId });
        res.status(status.OK).send(comments);
      } else {
        res.status(status.NOT_FOUND).send('Post not found');
      }
    } else {
      const comments = await commentsModel.find();
      res.status(status.OK).send(comments);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(status.BAD_REQUEST).send(error.message);
    } else {
      res.status(status.BAD_REQUEST).send('An unknown error occurred');
    }
  }
};
