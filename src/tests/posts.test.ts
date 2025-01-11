import request from 'supertest';
import { createExpress } from '../createExpress';
import mongoose from 'mongoose';
import postModel from '../models/postsModel';
import { Express } from 'express';
import userModel, { IUser } from '../models/usersModel';
import status from 'http-status';

var app: Express;

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  email: 'test@user.com',
  username: 'shir',
  password: 'testpassword',
};

beforeAll(async () => {
  console.log('beforeAll');
  app = await createExpress();
  await postModel.deleteMany();
  await userModel.deleteMany();

  await request(app).post('/auth/register').send(testUser);
  const responseLogin = await request(app).post('/auth/login').send(testUser);
  testUser.accessToken = responseLogin.body.accessToken;
  testUser._id = responseLogin.body._id;
  expect(testUser.accessToken).toBeDefined();
});

afterAll((done) => {
  console.log('afterAll');
  mongoose.connection.close();
  done();
});

let postId = '';
describe('Posts Tests', () => {
  test('Get all posts', async () => {
    const response = await request(app)
      .get('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(response.statusCode).toBe(status.OK);
    expect(response.body.length).toBe(0);
  });

  test('Create new post and comment', async () => {
    const responseNewPost = await request(app)
      .post('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        title: 'New Post 1',
        content: 'New Content 1',
        sender: testUser._id,
      });
    expect(responseNewPost.statusCode).toBe(status.CREATED);
    expect(responseNewPost.body).toMatchObject({
      title: 'New Post 1',
      content: 'New Content 1',
      sender: testUser._id,
    });

    postId = responseNewPost.body._id;

    const responseCreateComment = await request(app)
      .post('/comments')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        content: 'This is a comment',
        sender: testUser._id,
        postId,
      });

    expect(responseCreateComment.statusCode).toBe(status.CREATED);
  });

  test('Create new post - dont send a sender', async () => {
    const response = await request(app)
      .post('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        title: 'New Post 2',
        content: 'New Content 2',
      });
    expect(response.statusCode).toBe(status.CREATED);
    expect(response.body).toMatchObject({
      title: 'New Post 2',
      content: 'New Content 2',
      sender: testUser._id,
    });
  });

  test('Create new post - sender not exists', async () => {
    const response = await request(app)
      .post('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        title: 'New post',
        content: 'hi',
        sender: '678156fa8d1a5cce22322222',
      });
    expect(response.statusCode).toBe(status.NOT_FOUND);
    expect(response.text).toBe('User not found');
  });

  test('Get post by id', async () => {
    const response = await request(app)
      .get(`/posts/${postId}`)
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(response.statusCode).toBe(status.OK);
    expect(response.body).toMatchObject({
      content: 'New Content 1',
      title: 'New Post 1',
      sender: testUser._id,
    });
  });

  test('Get post by sender', async () => {
    const response = await request(app)
      .get(`/posts?sender=${testUser._id}`)
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(response.statusCode).toBe(status.OK);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toMatchObject({
      content: 'New Content 1',
      title: 'New Post 1',
      sender: testUser._id,
    });
  });

  test('Add new post to same user', async () => {
    const responseNewPost = await request(app)
      .post('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        title: 'New Post 3',
        content: 'New Content 3',
        sender: testUser._id,
      });
    expect(responseNewPost.statusCode).toBe(status.CREATED);
    const response = await request(app)
      .get('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(response.statusCode).toBe(status.OK);
    expect(response.body.length).toBe(3);
  });

  test('Delete Post', async () => {
    const responseCheckComments1 = await request(app)
      .get(`/comments?postId=${postId}`)
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(responseCheckComments1.body.length).toBe(1);

    const response = await request(app)
      .delete(`/posts/${postId}`)
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(response.statusCode).toBe(status.OK);

    const responseFindDeletedPost = await request(app)
      .get(`/posts/${postId}`)
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(responseFindDeletedPost.statusCode).toBe(status.NOT_FOUND);

    const responseCheckComments = await request(app)
      .get(`/comments?postId=${postId}`)
      .set({ authorization: `JWT ${testUser.accessToken}` });
    expect(responseCheckComments.statusCode).toBe(status.NOT_FOUND);
    expect(responseCheckComments.text).toEqual('Post not found');
  });

  test('Create Post fail', async () => {
    const response = await request(app)
      .post('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        content: 'Only content',
      });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('Update a post', async () => {
    const responseNewPost = await request(app)
      .post('/posts')
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        title: 'New post',
        content: 'hi',
        sender: testUser._id,
      });
    expect(responseNewPost.statusCode).toBe(status.CREATED);
    const postId = responseNewPost.body._id;
    const response = await request(app)
      .put(`/posts/${postId}`)
      .set({ authorization: `JWT ${testUser.accessToken}` })
      .send({
        title: 'Updated titleeeeeeee',
        content: 'Updated content',
      });
    expect(response.statusCode).toBe(status.OK);
    expect(response.body).toMatchObject({
      title: 'Updated titleeeeeeee',
      content: 'Updated content',
      sender: testUser._id,
    });
  });
});
