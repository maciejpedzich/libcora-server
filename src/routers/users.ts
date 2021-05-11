import { Router } from 'express';
import UsersService from '../services/users';
import authMiddleware from '../middleware/auth';

const usersService = new UsersService();
const usersRouter = Router();

usersRouter.use(authMiddleware);

usersRouter.get('/', usersService.getMatchingUsers);

usersRouter.post('/favourite/:userId', usersService.favouriteUser);

usersRouter.post('/ignore/:userId', usersService.ignoreUser);

export default usersRouter;
