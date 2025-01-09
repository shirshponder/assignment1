import { Request, Response } from 'express';
import status from 'http-status';
import bcrypt from 'bcrypt';
import userModel from '../../models/usersModel';
import { generateToken } from './utils/generateToken';
import { verifyRefreshToken } from './utils/verifyRefreshToken';
import { IUserDocument } from '../../types/IUserDocument';

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
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(status.BAD_REQUEST).send('wrong username or password');
      return;
    }

    if (!email || !password) {
      res.status(status.BAD_REQUEST).send('email or password are missing');
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(status.BAD_REQUEST).send('wrong username or password');
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      res.status(500).send('Server Error');
      return;
    }

    await generateAndSaveUser(res, user);
  } catch (err) {
    res.status(status.BAD_REQUEST).send(err);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    await user.save();
    res.status(status.OK).send({ _id: user.id });
  } catch (err) {
    res.status(status.BAD_REQUEST).send('fail');
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);
    if (!user) {
      res.status(status.BAD_REQUEST).send('');
      return;
    }

    await generateAndSaveUser(res, user);
  } catch (err) {
    res.status(status.BAD_REQUEST).send(err);
  }
};

const generateAndSaveUser = async (res: Response, user: IUserDocument) => {
  try {
    const tokens = generateToken(user._id);

    if (!tokens) {
      res.status(status.INTERNAL_SERVER_ERROR).send('Server Error');
      return;
    }
    const { accessToken, refreshToken } = tokens;

    if (!user.refreshToken) {
      user.refreshToken = [];
    }
    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(status.OK).send({ accessToken, refreshToken, _id: user._id });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).send('Server Error');
    return;
  }
};
