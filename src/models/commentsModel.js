import { Schema, model } from 'mongoose';
import postModel from './postsModel.js';

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'posts',
      required: true,
      validate: {
        validator: async function (value) {
          return await postModel.exists({ _id: value });
        },
        message: 'The referenced postId does not exist.',
      },
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const commentModel = model('comments', commentSchema);

export default commentModel;
