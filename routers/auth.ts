import { Router } from 'express';
import AuthService from '../services/auth';

import validate from '../middleware/validate';
import User from '../models/user';

import authMiddleware from '../middleware/auth';
import generateTokensMiddleware from '../middleware/generate-tokens';

const authService = new AuthService();
const authRouter = Router();

authRouter.post('/register', validate(User), authService.register);

authRouter.post(
  '/log-in',
  validate(User, { skipMissingProperties: true }),
  authService.logIn
);

authRouter.post('/refresh', authMiddleware);

authRouter.use(generateTokensMiddleware);

export default authRouter;
