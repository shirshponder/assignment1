import express from 'express';
import bodyParser from 'body-parser';
import postsRoute from './routes/postsRoute.js';
import commentsRoute from './routes/commentsRoute.js';
import { connectDatabase } from './config/connectToDatabase.js';

export const createExpress = async () => {
  const app = express();
  await connectDatabase();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/posts', postsRoute);
  app.use('/comments', commentsRoute);

  return app;
};
