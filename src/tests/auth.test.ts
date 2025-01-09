import request from 'supertest';
import { createExpress } from '../createExpress';
import mongoose from 'mongoose';
import postModel from '../models/postsModel';
import { Express } from 'express';
import userModel, { IUser } from '../models/usersModel';

var app: Express;

beforeAll(async () => {
  console.log('beforeAll');
  app = await createExpress();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll((done) => {
  console.log('afterAll');
  mongoose.connection.close();
  done();
});

const baseUrl = '/auth';

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  email: 'test@user.com',
  username: 'test',
  password: 'testPassword',
};

describe('Auth test register', () => {
  test('Success register', async () => {
    const response = await request(app)
      .post(baseUrl + '/register')
      .send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test('Try to register with exist user', async () => {
    const response = await request(app)
      .post(baseUrl + '/register')
      .send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test('Send only email', async () => {
    const response = await request(app)
      .post(baseUrl + '/register')
      .send({
        email: 'fake@email.com',
      });
    expect(response.statusCode).not.toBe(200);
  });
  test('Send only empty email', async () => {
    const response = await request(app)
      .post(baseUrl + '/register')
      .send({
        email: '',
        password: 'fakePassword',
      });
    expect(response.statusCode).not.toBe(200);
  });
});
describe('Auth test login', () => {
  test('Success login - get back the same valus and set user', async () => {
    const response = await request(app)
      .post(baseUrl + '/login')
      .send(testUser);

    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    expect(response.body._id).toBeDefined();

    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  test('Check tokens are not the same - new login get different tokens', async () => {
    const response = await request(app)
      .post(baseUrl + '/login')
      .send(testUser);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;

    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
  });

  test('Login fail - wrong password', async () => {
    const response = await request(app)
      .post(baseUrl + '/login')
      .send({
        email: testUser.email,
        password: 'fakePassword',
      });
    expect(response.statusCode).not.toBe(200);
  });

  test('Login fail - user does not exist', async () => {
    const response = await request(app)
      .post(baseUrl + '/login')
      .send({
        email: 'fake@email.com',
        password: 'fakePassword',
      });
    expect(response.statusCode).not.toBe(200);
  });

  test('Login fail - login only with email', async () => {
    const responseRegister = await request(app)
      .post(baseUrl + '/register')
      .send({
        email: 'fake@email.com',
        username: 'fake',
        password: '123',
      });
    expect(responseRegister.statusCode).toBe(200);
    const response = await request(app)
      .post(baseUrl + '/login')
      .send({
        email: 'fake@email.com',
      });
    expect(response.statusCode).not.toBe(200);
  });
});

describe('Auth test - try to send post', () => {
  test('With authorization- success upload post', async () => {
    const responseLogin = await request(app)
      .post(baseUrl + '/login')
      .send(testUser);

    expect(responseLogin.statusCode).toBe(200);

    const responseNewPost = await request(app)
      .post('/posts')
      .set({ authorization: 'JWT ' + responseLogin.body.accessToken })
      .send({
        title: 'New post',
        content: 'Important content',
        sender: testUser.username,
      });
    expect(responseNewPost.statusCode).toBe(201);
  });

  test('Without authorization- faild upload post', async () => {
    const response = await request(app).post('/posts').send({
      title: 'New post',
      content: 'Important content',
      sender: 'shir',
    });
    expect(response.statusCode).not.toBe(201);
  });
});

describe('Auth test refresh', () => {
  test('Success to refresh and get tokens', async () => {
    const response = await request(app)
      .post(baseUrl + '/refresh')
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response.statusCode).toBe(200);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test('Double use refresh token', async () => {
    const response = await request(app)
      .post(baseUrl + '/refresh')
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(response.statusCode).toBe(200);

    // get new refresh token
    const newRefreshToken = response.body.refreshToken;

    const secondAttemptResponse = await request(app)
      .post(baseUrl + '/refresh')
      .send({
        refreshToken: testUser.refreshToken,
      });

    // remove all refresh token and reset to empty array
    expect(secondAttemptResponse.statusCode).not.toBe(200);

    const response3 = await request(app)
      .post(baseUrl + '/refresh')
      .send({
        refreshToken: newRefreshToken,
      });

    // no refresh tokens
    expect(response3.statusCode).not.toBe(200);
  });
});

describe('Auth test logout', () => {
  test('Success logout - remove the used refresh token', async () => {
    const responseLogin = await request(app)
      .post(baseUrl + '/login')
      .send(testUser);
    expect(responseLogin.statusCode).toBe(200);

    testUser.accessToken = responseLogin.body.accessToken;
    testUser.refreshToken = responseLogin.body.refreshToken;

    const responseLogout = await request(app)
      .post(baseUrl + '/logout')
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(responseLogout.statusCode).toBe(200);

    const responseRefresh = await request(app)
      .post(baseUrl + '/refresh')
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(responseRefresh.statusCode).not.toBe(200);
  });
});

describe('Test timeout token', () => {
  jest.setTimeout(10000);

  test('Success - do refresh before upload', async () => {
    const responseLogin = await request(app)
      .post(baseUrl + '/login')
      .send(testUser);
    expect(responseLogin.statusCode).toBe(200);
    testUser.accessToken = responseLogin.body.accessToken;
    testUser.refreshToken = responseLogin.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const responseRefresh = await request(app)
      .post(baseUrl + '/refresh')
      .send({
        refreshToken: testUser.refreshToken,
      });
    expect(responseRefresh.statusCode).toBe(200);
    testUser.accessToken = responseRefresh.body.accessToken;

    const responseNewPost = await request(app)
      .post('/posts')
      .set({ authorization: 'JWT ' + testUser.accessToken })
      .send({
        title: 'Test Post',
        content: 'Test Content',
        sender: testUser.username,
      });
    expect(responseNewPost.statusCode).toBe(201);
  });

  test('Faild - time has passed', async () => {
    const responseLogin = await request(app)
      .post(baseUrl + '/login')
      .send(testUser);
    expect(responseLogin.statusCode).toBe(200);
    testUser.accessToken = responseLogin.body.accessToken;
    testUser.refreshToken = responseLogin.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const responseNewPost = await request(app)
      .post('/posts')
      .set({ authorization: 'JWT ' + testUser.accessToken })
      .send({
        title: 'New Post',
        content: 'Importent content',
        sender: 'shir',
      });

    expect(responseNewPost.statusCode).not.toBe(201);
  });
});
