import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import setLastSeen from '../utils/set-last-seen';

import {
  IUser,
  IBasicUser,
  IGuestUser,
  TUserEditable,
} from '../feedfarm-shared/types';
import migrateAllUserFeeds from '../utils/migrate-all-user-feeds';
import updateAllUserInteractions from '../utils/update-all-user-interactions';
// import giveOneMonthPremiumToReferree from '../utils/give-one-month-premium-to-referree';

const firestore = admin.firestore();

type TUserFields = keyof TUserEditable;

export async function impl(
  data: { currentUser: Partial<TUserEditable> },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const sourceUid = context.auth.uid;

    await setLastSeen(sourceUid);

    const allowedFields = [
      'username',
      'bio',
      'userPhoto',
      'language',
      'isTestUser',
    ] as TUserFields[];

    const newCurrentUser = allowedFields.reduce((prev, currentKey) => {
      if (data.currentUser[currentKey] !== undefined) {
        return {
          ...prev,
          [currentKey]: data.currentUser[currentKey],
        } as Partial<IUser>;
      } else {
        return prev;
      }
    }, {} as Partial<IUser>);

    if (newCurrentUser.username) {
      newCurrentUser.lcasedUsername = newCurrentUser.username.toLowerCase();
    }

    // const oldUser = (
    //   await firestore.doc(`/users/${sourceUid}`).get()
    // ).data() as IUser;

    // if (
    //   newPartialCurrentUser.photos &&
    //   newPartialCurrentUser.photos.length &&
    //   oldUser.isMatchedWithTwo
    // ) {
    //   await giveOneMonthPremiumToReferree(oldUser);
    // }

    const currentUser = (
      await firestore.doc(`/users/${sourceUid}`).get()
    ).data() as IUser;

    if (
      (newCurrentUser.username &&
        newCurrentUser.username !== currentUser.username) ||
      (newCurrentUser.userPhoto &&
        newCurrentUser.userPhoto !== currentUser.userPhoto)
    ) {
      const newBasicUser: IBasicUser = {
        uid: currentUser.id,
        username: newCurrentUser.username || currentUser.username,
        userPhoto: newCurrentUser.userPhoto || currentUser.userPhoto,
      };

      const oldUser: IGuestUser = {
        token: '',
        id: currentUser.id,
        username: currentUser.username,
        userPhoto: currentUser.userPhoto,
        isGuest: false,
        birthAvatar: currentUser.birthAvatar,
      };

      await migrateAllUserFeeds(oldUser, newBasicUser);

      await updateAllUserInteractions(currentUser.id, newBasicUser);
    }

    await firestore
      .doc(`/users/${sourceUid}`)
      .set(newCurrentUser, { merge: true });

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
