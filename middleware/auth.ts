import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { verify, TokenExpiredError } from 'jsonwebtoken';

import User from '../models/user';
import RequestWithUser from '../interfaces/request-with-user';
import TokenPayload from '../interfaces/token-payload';

export default async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  console.log(req.path);
  const userRepository = getRepository(User);
  const secret = process.env.JWT_SECRET as string;

  try {
    const accessToken = (req.headers.authorization as string).split(/ +/)[1];
    const accessTokenPayload = verify(accessToken, secret) as TokenPayload;

    delete accessTokenPayload.iat;
    delete accessTokenPayload.exp;

    req.user = await userRepository.findOne(accessTokenPayload.userId);

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError && req.path === '/refresh') {
      try {
        const refreshToken = req.cookies['Authorization-Refresh'];
        const refreshTokenPayload = verify(
          refreshToken,
          secret
        ) as TokenPayload;

        delete refreshTokenPayload.iat;
        delete refreshTokenPayload.exp;

        req.user = await userRepository.findOne(refreshTokenPayload.userId);

        return next();
      } catch (e) {
        return next(e);
      }
    }

    return next(error);
  }
}
