import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IFeed } from '../feedfarm-shared/types';
import getUserRoles from '../utils/get-user-roles';

const firestore = admin.firestore();

export async function impl(
  data: { feed: IFeed },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;
    const feed = data.feed;

    const roles = await getUserRoles({ uid, feedId: feed.id });

    if (!roles.feedOwner) {
      return { error: true, message: 'user-not-owner' };
    }

    await firestore.doc(`/feeds/${feed.id}`).update(feed);

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
