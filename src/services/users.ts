import { Response, NextFunction } from 'express';
import { getRepository, Between, Not, In } from 'typeorm';
import { addYears, subYears } from 'date-fns';

import RequestWithUser from '../types/request-with-user';
import User from '../models/user';
import LocationObject from '../types/location-object';
import calculateEloRating from '../utils/calculate-elo-rating';

export default class UsersService {
  public async getPossiblyMatchingUsers(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userRepository = getRepository(User);

    try {
      const {
        id,
        favouritedUsers,
        ignoredUsers,
        favouriteGenres,
        dob,
        location
      } = req.user as User;

      const dobObj = new Date(dob);
      const fiveYearsBeforeDob = subYears(dobObj, 5).toISOString();
      const fiveYearsAfterDob = addYears(dobObj, 5).toISOString();

      const favouritedUsersIds = favouritedUsers.map((u) => u.id);
      const idsToExclude = ignoredUsers
        .map((u) => u.id)
        .concat([id, ...favouritedUsersIds]);

      const currentUserLocation = location as LocationObject;
      const latLongStr = Object.values(currentUserLocation).join(' ');

      const users = await userRepository
        .createQueryBuilder('user')
        .where({
          id: Not(In(idsToExclude)),
          dob: Between(fiveYearsBeforeDob, fiveYearsAfterDob)
        })
        .andWhere('"user"."favouriteGenres" && ARRAY[:...favouriteGenres]', {
          favouriteGenres
        })
        .andWhere(
          `ST_DISTANCE(
            ST_GeographyFromText(('POINT(' || :latLongStr) || ')'),
            ST_GeographyFromText(
              'POINT' || array_to_string(
                regexp_split_to_array("user"."location"::text, ','),
                ' '
              )
            )
          ) < 100000`,
          { latLongStr }
        )
        .orderBy('"user"."rating"', 'DESC')
        .limit(10)
        .getMany();

      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  }

  public async favouriteUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userRepository = getRepository(User);

    try {
      const currentUser = req.user as User;
      const userToFavourite = await userRepository.findOneOrFail(
        req.params.userId
      );
      const isIgnoredUser = currentUser.ignoredUsers.find(
        (u) => u.id === userToFavourite.id
      );

      if (isIgnoredUser) {
        currentUser.ignoredUsers.splice(
          currentUser.ignoredUsers.indexOf(userToFavourite),
          1
        );
      }

      currentUser.location = Object.values(currentUser.location).join();
      userToFavourite.location = Object.values(userToFavourite.location).join();

      userToFavourite.rating = calculateEloRating(
        currentUser.rating,
        userToFavourite.rating,
        1
      );
      currentUser.favouritedUsers.push(userToFavourite);
      await userRepository.save(currentUser);

      return res.status(200).json({
        message: 'User favourited successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  public async ignoreUser(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const userRepository = getRepository(User);

    try {
      const currentUser = req.user as User;
      const userToIgnore = await userRepository.findOneOrFail(
        req.params.userId
      );
      const isFavouritedUser = currentUser.favouritedUsers.find(
        (u) => u.id === userToIgnore.id
      );

      if (isFavouritedUser) {
        currentUser.favouritedUsers.splice(
          currentUser.favouritedUsers.indexOf(userToIgnore),
          1
        );
      }

      userToIgnore.location = Object.values(userToIgnore.location).join();
      currentUser.location = Object.values(currentUser.location).join();

      userToIgnore.rating = calculateEloRating(
        currentUser.rating,
        userToIgnore.rating,
        0
      );
      currentUser.ignoredUsers.push(userToIgnore);
      await userRepository.save(currentUser);

      return res.status(200).json({
        message: 'User ignored successfully'
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getUserMatches(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { favouritedUsers, ignoredUsers } = req.user as User;

      return res.status(200).json({ favouritedUsers, ignoredUsers });
    } catch (error) {
      return next(error);
    }
  }

  public getAllUserMatches(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { favouritedUsers, ignoredUsers } = req.user as User;

      return res.status(200).json({ favouritedUsers, ignoredUsers });
    } catch (error) {
      return next(error);
    }
  }

  public async getMutualMatches(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { favouritedUsers, id } = req.user as User;
      const currentUserId = id;
      const matches = favouritedUsers.filter((user) =>
        user.favouritedUsers.find((u) => u.id === currentUserId)
      );

      return res.status(200).json(matches);
    } catch (error) {
      return next(error);
    }
  }
}
