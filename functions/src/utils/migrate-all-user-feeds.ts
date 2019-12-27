import * as admin from 'firebase-admin';
import {
  IBasicUser,
  IGuestUser,
  IFeed,
  TUserRole,
} from '../feedfarm-shared/types';

const firestore = admin.firestore();

export default async function migrateAllUserFeeds(
  oldUser: IGuestUser | IBasicUser,
  newUser: IBasicUser,
) {
  let oldBasicUser: IBasicUser;
  let migratingGuest = false;

  if ('token' in oldUser) {
    oldBasicUser = {
      uid: oldUser.id,
      username: oldUser.username,
      userPhoto: oldUser.userPhoto,
    };
    migratingGuest = true;
  } else {
    oldBasicUser = oldUser;
  }

  if (migratingGuest) {
    const userFeeds = await firestore
      .collection('/feeds')
      .where('owners', 'array-contains', oldBasicUser)
      .get();

    await Promise.all(
      userFeeds.docs.map(feedDoc => {
        const feed = feedDoc.data() as IFeed;
        if (feed.owners[0].uid === oldBasicUser.uid) {
          feed.owners[0] = newUser;
          return feedDoc.ref.update(feed);
        }
        return Promise.resolve(null);
      }),
    );
  } else {
    const roles: TUserRole[] = ['owners', 'moderators', 'members'];

    for (const role of roles) {
      const userFeeds = await firestore
        .collection('/feeds')
        .where(role, 'array-contains', oldBasicUser)
        .get();

      const feedUpdates = userFeeds.docs.map(feedDoc => {
        const feed = feedDoc.data() as IFeed;
        const userRecord = feed[role].find(
          user => user.uid === oldBasicUser.uid,
        );
        if (userRecord) {
          userRecord.userPhoto = newUser.userPhoto;
          userRecord.username = newUser.username;
          return feedDoc.ref.update(feedDoc);
        }
        return Promise.resolve(null);
      });

      await Promise.all(feedUpdates);
    }
  }
}
