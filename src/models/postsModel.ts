import { Schema, model } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  owner: string;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
});

const postModel = model<IPost>('posts', postSchema);

export default postModel;
