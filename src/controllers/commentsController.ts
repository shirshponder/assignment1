import status from 'http-status';
import { Request, Response } from 'express';
import BaseController from './baseController';
import commentsModel, { IComments } from '../models/commentsModel';
import postModel from '../models/postsModel';

class CommentsController extends BaseController<IComments> {
  constructor() {
    super(commentsModel);
  }

  async updateCommentById(req: Request, res: Response) {
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
      res.status(status.BAD_REQUEST).send(error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const postId = req.query.postId;

      if (postId) {
        const post = await postModel.findById(postId);
        if (!post) {
          throw { status: status.NOT_FOUND, message: 'Post not found' };
        }
      }
      super.getAll(req, res);
    } catch (error: any) {
      res
        .status(error?.status || status.BAD_REQUEST)
        .send(error?.message || error);
    }
  }
}

export default new CommentsController();
