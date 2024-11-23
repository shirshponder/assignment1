import status from 'http-status';
import commentsModel from '../models/commentsModel.js';
import postModel from '../models/postsModel.js';

export const createComment = async (req, res) => {
  const commentBody = req.body;

  try {
    const comment = await commentsModel.create(commentBody);
    res.status(status.CREATED).send(comment);
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

export const updateCommentById = async (req, res) => {
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
      res.send(comment);
    } else {
      res.status(status.NOT_FOUND).send('Comment not found');
    }
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error.message);
  }
};

export const getComments = async (req, res) => {
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
    res.status(status.BAD_REQUEST).send(error.message);
  }
};
