import { getRepository } from 'typeorm';
import * as faker from 'faker';
import { hashSync } from 'bcrypt';
import { sampleSize, random } from 'lodash';

import User from '../models/user';
import { addYears, subYears } from 'date-fns';
import { plainToClass } from 'class-transformer';

export default async function seedDB() {
  try {
    const userRepository = getRepository(User);

    await userRepository.delete({});

    const userRecords = [...Array(3001).keys()].slice(1).map((i) => {
      console.log(i);

      const firstname = faker.name.firstName();
      const lastname = faker.name.lastName();

      const lat = faker.address.latitude(52.257205433984396, 50.27088369869156);
      const long = faker.address.longitude(
        20.992167441700072,
        19.00913533056026
      );
      const location = `${lat},${long}`;

      const BOOK_GENRES = [
        'Fantasy',
        'Adventure',
        'Romance',
        'Dystopian',
        'Mystery',
        'Horror',
        'Thriller',
        'Paranormal',
        'Historical Fiction',
        'Science Fiction',
        'Memoir',
        'Cooking',
        'Art',
        'Self-help / Personal',
        'Health',
        'History',
        'Travel',
        'Guide / How-to',
        'Families & Relationships',
        'Humour'
      ];

      const baseDate = new Date('1990-01-01');
      const minDate = subYears(baseDate, 10);
      const maxDate = addYears(baseDate, 10);

      const userObj = {
        firstname,
        lastname,
        email: faker.internet.email(firstname, lastname),
        password: hashSync('qwertyuiop', 10),
        avatarUrl: faker.internet.avatar(),
        dob: faker.date.between(minDate, maxDate),
        bio: faker.lorem.sentences(2),
        favouriteGenres: sampleSize(BOOK_GENRES, random(3, 5)),
        rating: random(700, 2500, true),
        location
      };
      const user = plainToClass(User, userObj);

      return user;
    });

    await userRepository.save(userRecords as unknown as User[]);

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
