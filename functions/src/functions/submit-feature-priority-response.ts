// import { IPublicUser, IUser } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { TFeatureType, TFeatureResponseType } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export async function impl(
  data: { featureType: TFeatureType; response: TFeatureResponseType },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const { featureType, response } = data;

    const requesters =
      (await firestore.doc(`/feature-requests/${featureType}`).get()).data() ||
      {};

    if (requesters[uid] && response === 'saw') {
      return {};
    }

    requesters[uid] = response;

    await firestore.doc(`/feature-requests/${featureType}`).set(requesters);

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
