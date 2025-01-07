import { Schema, model } from 'mongoose';
import postModel from './postsModel';

export interface IComments {
  content: string;
  owner: string;
  postId: {
    type: string;
    ref: string;
    validate: {
      validator: (value: string) => Promise<{
        _id: string;
      } | null>;
      message: string;
    };
  };
}

const commentSchema = new Schema<IComments>(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      ref: 'posts',
      required: true,
      validate: {
        validator: async function (value: string) {
          return await postModel.exists({ _id: value });
        },
        message: 'The referenced postId does not exist.',
      },
    },
  },

  { timestamps: true }
);

const commentModel = model('comments', commentSchema);

export default commentModel;
