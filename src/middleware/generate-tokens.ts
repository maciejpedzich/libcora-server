import { Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';

import RequestWithUser from '@/interfaces/request-with-user';
import User from '@/models/user';

export default function generateTokensMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user as User;
  const secret = process.env.JWT_SECRET as string;
  const TWO_WEEKS = 1209600000;

  const accessToken = sign({ userId: id, grant: 'ACCESS' }, secret, {
    expiresIn: '10m'
  });
  const refreshToken = sign({ userId: id, grant: 'REFRESH' }, secret, {
    expiresIn: '14d'
  });

  res.setHeader('Authorization', accessToken);
  res.cookie('Authorization-Refresh', refreshToken, {
    maxAge: TWO_WEEKS,
    httpOnly: true
  });

  return res.status(200).json({ userId: id });
}
