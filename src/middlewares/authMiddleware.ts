import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.header('authorization');
  const token = authorization?.split(' ')[1];

  if (!token) {
    res.status(status.UNAUTHORIZED).send('Access Denied');
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(status.INTERNAL_SERVER_ERROR).send('Server Error');
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      res.status(status.UNAUTHORIZED).send('Access Denied');
      return;
    }

    req.params.userId = (payload as JwtPayload)._id;
    next();
  });
};
