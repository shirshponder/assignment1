import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import postsRoute from './routes/postsRoute';
import commentsRoute from './routes/commentsRoute';
import usersRoute from './routes/usersRoute';
import authRoute from './routes/authRoute';
import { connectDatabase } from './config/connectToDatabase';
import { authMiddleware } from './middlewares/authMiddleware';

export const createExpress = async () => {
  const app = express();
  await connectDatabase();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/auth', authRoute);
  app.use('/posts', authMiddleware, postsRoute);
  app.use('/comments', authMiddleware, commentsRoute);
  app.use('/users', authMiddleware, usersRoute);

  return app;
};
