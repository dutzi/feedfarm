import { IUser, IPublicUser } from '../feedfarm-shared/types';

export default function getPublicUser(user: IUser) {
  const ret: IPublicUser = {
    id: user.id,
    photos: [user.userPhoto],
    username: user.username,
    bio: user.bio,
  };

  if (user.location) {
    ret.location = {
      city: user.location.city,
      country: user.location.country,
    };
  }

  return ret;
}
