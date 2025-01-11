import request from 'supertest';
import { createExpress } from '../createExpress';
import mongoose from 'mongoose';
import { Express } from 'express';
import userModel, { IUser } from '../models/usersModel';
import status from 'http-status';
import Test from 'supertest/lib/test';
import TestAgent from 'supertest/lib/agent';

var app: Express;
let requestWithAuth: TestAgent<Test>;

type User = IUser & {
  accessToken?: string;
  refreshToken?: string;
};

const testUser: User = {
  email: 'test@user.com',
  username: 'Mich',
  password: 'testpassword',
};

beforeAll(async () => {
  console.log('beforeAll');
  app = await createExpress();
  await userModel.deleteMany();

  await request(app).post('/auth/register').send(testUser);
  const responseLogin = await request(app).post('/auth/login').send(testUser);
  testUser.accessToken = responseLogin.body.accessToken;
  testUser._id = responseLogin.body._id;
  expect(testUser.accessToken).toBeDefined();

  const defaultHeaders = {
    authorization: `JWT ${testUser.accessToken}`,
  };
  // creates a persistent agent that maintains cookies and headers across multiple requests
  requestWithAuth = request.agent(app).set(defaultHeaders);
});

afterAll((done) => {
  console.log('afterAll');
  mongoose.connection.close();
  done();
});

describe('Users Tests', () => {
  test('Get all users', async () => {
    const response = await requestWithAuth.get('/users');
    expect(response.statusCode).toBe(status.OK);
    expect(response.body.length).toBe(1);
  });
});
