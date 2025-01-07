import status from 'http-status';
import { Request, Response } from 'express';
import BaseController from './baseController';
import commentsModel, { IComments } from '../models/commentsModel';

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
}

export default new CommentsController();
