import jwt from 'jsonwebtoken';
import { ITokens } from '../../../ITokens';

export const generateToken = (userId: string): ITokens | null => {
  if (!process.env.TOKEN_SECRET) {
    return null;
  }
  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES },
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES },
  );

  return { accessToken, refreshToken };
};
