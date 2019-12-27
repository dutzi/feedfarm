// import { IPublicUser, IUser } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';

const firestore = admin.firestore();

export async function impl(
  data: { feedName: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const { feedName } = data;

    const feeds = await firestore
      .collection('/feeds')
      .where('canonicalName', '==', feedName)
      .get();

    return { feedId: feeds.docs[0].data().id };
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
