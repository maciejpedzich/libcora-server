import { Router } from 'express';
import UsersService from '../services/users';
import authMiddleware from '../middleware/auth';

const usersService = new UsersService();
const usersRouter = Router();

usersRouter.use(authMiddleware);

usersRouter.get('/', usersService.getPossiblyMatchingUsers);

usersRouter.post('/favourite/:userId', usersService.favouriteUser);

usersRouter.post('/ignore/:userId', usersService.ignoreUser);

usersRouter.get('/matches', usersService.getUserMatches);

usersRouter.get('/mutual-matches', usersService.getMutualMatches);

export default usersRouter;
