import { Request, Response } from 'express';
import status from 'http-status';
import bcrypt from 'bcrypt';
import userModel from '../models/usersModel';

export const register = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const username = req.body.username;

    const existingEmail = await userModel.findOne({ email });
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername || existingEmail) {
      res.status(status.BAD_REQUEST).send('username or email already exists');
      return;
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });
    res.status(status.OK).send(user);
  } catch (error) {
    res.status(status.BAD_REQUEST).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(status.BAD_REQUEST).send('email or password are missing');
    return;
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(status.BAD_REQUEST).send('wrong username or password');
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(status.BAD_REQUEST).send('wrong username or password');
      return;
    }
    // return access token
    res.status(status.OK).send('login successful');
  } catch (err) {
    res.status(400).send(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  // need to implement with refresh token
};

//Need to add JWT token generation and refresh token logic
