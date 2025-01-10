import status from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import postModel, { IPost } from '../models/postsModel';
import BaseController from './baseController';
import commentModel from '../models/commentsModel';
import userModel from '../models/usersModel';

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const sender = req.body.sender;

      if (sender) {
        // TODO: check it
        if (mongoose.Types.ObjectId.isValid(sender)) {
          const user = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(sender),
          });
          if (!user) {
            res.status(status.NOT_FOUND).send('User not found');
            return;
          }
        }
      } else {
        const userId = req.body.payload.userId;
        const post = {
          ...req.body,
          sender: userId,
        };
        req.body = post;
      }

      super.create(req, res);
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }

  async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id;
      const comments = await commentModel.find({ postId });
      comments.forEach(async (comment) => {
        await commentModel.findByIdAndDelete({ _id: comment._id.toString() });
      });

      super.deleteItem(req, res);
    } catch (error) {
      res.status(status.BAD_REQUEST).send(error);
    }
  }
}

export default new PostsController();
