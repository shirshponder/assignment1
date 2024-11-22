import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import postsRoute from './routes/postsRoute.js';

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/posts', postsRoute);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
