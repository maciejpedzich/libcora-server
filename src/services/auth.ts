import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { hash, compare } from 'bcrypt';

import RequestWithUser from '../types/request-with-user';
import User from '../models/user';
import InvalidCredentialsError from '../errors/invalid-credentials';

export default class AuthService {
  public async register(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userRepository = getRepository(User);

    try {
      req.body.password = await hash(req.body.password, 10);
      req.body.favouritedUsers = [];
      req.body.ignoredUsers = [];

      const user = (userRepository.create(req.body) as unknown) as User;
      req.user = await userRepository.save(user);

      return next();
    } catch (error) {
      return next(error);
    }
  }

  public async logIn(req: RequestWithUser, res: Response, next: NextFunction) {
    const userRepository = getRepository(User);

    try {
      const allKeys = userRepository.metadata.columns.map(
        (col) => col.propertyName
      ) as (keyof User)[];

      const { email, password } = req.body;
      const user = await userRepository.findOne(
        { email },
        { select: allKeys, relations: ['favouritedUsers', 'ignoredUsers'] }
      );

      if (user) {
        const passwordsMatch = await compare(password, user.password as string);

        if (passwordsMatch) {
          delete user.email;
          delete user.password;
          req.user = user;

          return next();
        }
      }

      throw new InvalidCredentialsError();
    } catch (error) {
      return next(error);
    }
  }
}
