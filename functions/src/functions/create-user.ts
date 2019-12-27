import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
// import { IUser } from '../feedfarm-shared/types';
import sendMessage from '../utils/send-message';
import { ADMIN_UID } from '../utils/consts';
import isUsernameTaken from '../utils/is-username-taken';
import { isLegitUsername } from '../feedfarm-shared/utils';
// import publishToFeed from '../utils/publish-to-feed';
import getWelcomeMessage from '../utils/get-welcome-message';
import { TSupportedLanguages } from '../feedfarm-shared/types';
const cryptoRandomString = require('crypto-random-string');

const firestore = admin.firestore();

async function isReferrerIdTaken(referrerId: string) {
  const snapshot = await firestore
    .collection('/users')
    .where('referrerId', '==', referrerId)
    .get();
  return snapshot.docs.length > 0;
}

function generateReferrerId() {
  return cryptoRandomString({
    length: 10,
    characters:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
  });
}

export async function impl(
  data: { email: string; name: string; language: TSupportedLanguages },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const email = data.email.trim();
    const username = data.name.trim().slice(0, 30);
    const { language } = data;

    if (!isLegitUsername(username)) {
      return { error: true, errorCode: 'username-invalid' };
    }

    const available = !(await isUsernameTaken(username));

    if (!available) {
      return { error: true, errorCode: 'username-taken' };
    }

    if (!email || !username) {
      return { error: true, errorCode: 'missing-data' };
    }

    const userDocRef = firestore.doc(`/users/${uid}`);
    // const userPrivateDocRef = firestore.doc(`/users-private/${uid}`);
    const userDocData = await userDocRef.get();

    if (userDocData.exists) {
      return { error: true, errorCode: 'user-exists' };
    }

    let referrerId = generateReferrerId();

    while (await isReferrerIdTaken(referrerId)) {
      referrerId = generateReferrerId();
    }

    // await userDocRef.create({
    //   id: uid,
    //   username,
    //   lcasedUsername: username.toLowerCase(),
    //   bio: '',
    //   age: 27,
    //   status: 'm',
    //   email,
    //   filters: { lookingFor: ['f'], distance: 100, isAnywhere: true },
    //   photos: [],
    //   hiddenPhotos: [],
    //   favorites: [],
    //   photosRequests: [],
    //   notifications: [],
    //   allowPhotos: [],
    //   lastSampleVideoIndex: Object.keys(data.reactions).length,
    //   isSFWMode: false,
    //   isTestUser: false,
    //   hasAdBlock: false,
    //   language,
    //   referrerId,
    //   referreeId,
    //   uuid,
    //   isGuest: false,
    // } as IUser);

    // todo secure this
    // await Promise.all([
    //   firestore.doc(`/users/${uid}/match/tags`).set({
    //     data: data.tags,
    //   }),
    //   firestore.doc(`/users/${uid}/match/reactions`).set({
    //     data: data.reactions,
    //   }),
    // ]);

    const FieldValue = admin.firestore.FieldValue;
    await firestore
      .doc('/stats/site')
      .update({ numUsers: FieldValue.increment(1), lastUsername: username });

    await sendMessage({
      message: getWelcomeMessage(language),
      targetUid: uid,
      sourceUid: ADMIN_UID,
    });

    // await publishToFeed({
    //   type: 'user-joined',
    //   uid,
    //   username,
    //   userPhoto: '', // todo add user photo
    // });

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
