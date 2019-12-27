// import { IPublicUser, IUser } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IGuestUser, IUser, IBasicUser, IFeed } from '../feedfarm-shared/types';
import updateAllUserInteractions from '../utils/update-all-user-interactions';
import migrateAllUserFeeds from '../utils/migrate-all-user-feeds';

const firestore = admin.firestore();

type TRole = keyof Pick<
  IFeed,
  'owners' | 'moderators' | 'members' | 'bannedUsers'
>;

function migrateUserRolePlaceholder(
  role: TRole,
  feedDoc: FirebaseFirestore.QueryDocumentSnapshot,
  email: string,
  newUser: IBasicUser,
) {
  const feed = feedDoc.data() as IFeed;
  const newUsers = feed[role];
  const index = newUsers.findIndex(user => user.username === email);

  if (index > -1) {
    newUsers.splice(index, 1, newUser);
    feed[role] = newUsers;
    return feedDoc.ref.set(feed);
  }

  return Promise.resolve(null);
}

export async function impl(
  data: { token: string; email: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const { token, email } = data;

    const userCollection = await firestore
      .collection(`/users/`)
      .where('token', '==', token)
      .get();

    if (userCollection.empty) {
      return {
        error: true,
        message: 'token-not-found',
      };
    }

    const guestUser = userCollection.docs[0].data() as IGuestUser;

    const newUser: IUser = {
      id: uid,
      email,
      username: guestUser.username,
      lcasedUsername: guestUser.username.toLowerCase(),
      bio: '',
      userPhoto: guestUser.userPhoto,
      isTestUser: false,
      language: 'en', // todo
      referrerId: '', // todo
      isGuest: false,
      birthAvatar: guestUser.birthAvatar,
    };

    await firestore.doc(`/users/${uid}`).create(newUser);

    const newBasicUser: IBasicUser = {
      uid,
      username: guestUser.username,
      userPhoto: guestUser.userPhoto,
    };

    // owners, moderators, members, bannedUsers...

    const existingUserPlaceholder = await firestore
      .collection('/users')
      .where('username', '==', email)
      .get();

    if (!existingUserPlaceholder.empty) {
      const userPlaceholder = existingUserPlaceholder.docs[0].data() as IBasicUser;

      const roles: TRole[] = ['owners', 'moderators', 'members', 'bannedUsers'];

      const allRolesMigrationPromises = roles.map(role => {
        return firestore
          .collection('/feeds')
          .where(role, 'array-contains', userPlaceholder)
          .get()
          .then(collection => {
            const feedDocs = collection.docs;

            const roleMigrationPromises = feedDocs.map(feedDoc => {
              return migrateUserRolePlaceholder(
                role,
                feedDoc,
                email,
                newBasicUser,
              );
            });

            return Promise.all(roleMigrationPromises);
          });
      });

      await Promise.all(allRolesMigrationPromises);

      await existingUserPlaceholder.docs[0].ref.delete();
    }

    await migrateAllUserFeeds(guestUser, newBasicUser);

    await updateAllUserInteractions(guestUser.id, newBasicUser);

    await firestore.collection('/mail').add({
      to: email,
      from: 'dutzi@feed.farm',
      template: {
        name: 'welcome',
        data: {
          username: email.split('@')[0],
        },
      },
    });

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
