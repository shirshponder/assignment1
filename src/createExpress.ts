import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
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
  const port = process.env.PORT;

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Web Dev 2025 REST API - Assignment 2',
        version: '1.0.0',
        description: 'REST server including authentication using JWT',
      },
      servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ['./src/routes/*.ts'],
  };
  const specs = swaggerJsDoc(options);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

  return app;
};
