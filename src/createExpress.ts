import express from 'express';
import bodyParser from 'body-parser';
import postsRoute from './routes/postsRoute';
import commentsRoute from './routes/commentsRoute';
import { connectDatabase } from './config/connectToDatabase';

export const createExpress = async () => {
  const app = express();
  await connectDatabase();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/posts', postsRoute);
  app.use('/comments', commentsRoute);

  return app;
};
