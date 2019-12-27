import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import getUserRoles from '../utils/get-user-roles';
// import setLastSeen from '../utils/set-last-seen';

const firestore = admin.firestore();

export async function impl(
  data: { postId: string; feedId: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const { postId, feedId } = data;

    const roles = await getUserRoles({ uid, postId, feedId });

    // await setLastSeen(uid);

    if (
      roles.postAuthor ||
      roles.feedOwner ||
      roles.feedModerator ||
      roles.superAdmin
    ) {
      await firestore.doc(`/feeds/${feedId}/posts/${postId}`).delete();
    }

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
