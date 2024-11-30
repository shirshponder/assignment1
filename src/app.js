import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import postsRoute from './routes/postsRoute.js';
import commentsRoute from './routes/commentsRoute.js';
import { connectDatabase } from './config/connectToDatabase.js';

const main = async () => {
  const app = express();
  const port = process.env.PORT;
  await connectDatabase();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/posts', postsRoute);
  app.use('/comments', commentsRoute);

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
};

main();
