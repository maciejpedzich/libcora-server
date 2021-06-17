import User from '@/models/user';
import LocationObject from '@/types/location-object';

export default function parseLocationObj(user: User) {
  user.location = Object.values(user.location as LocationObject).join();

  if (user.favouritedUsers && user.ignoredUsers) {
    user.favouritedUsers = user.favouritedUsers.map(parseLocationObj);
    user.ignoredUsers = user.ignoredUsers.map(parseLocationObj);
  }

  return user;
}
