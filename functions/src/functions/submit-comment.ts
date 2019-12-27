import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
// import setLastSeen from '../utils/set-last-seen';
import { IPostComment, IUserAction } from '../feedfarm-shared/types';
import getCallCurrentUser from '../utils/get-call-current-user';

const firestore = admin.firestore();

export async function impl(
  data: { message: string; postId: string; feedId: string },
  context: functions.https.CallableContext,
) {
  // if (context.auth) {
  const currentUser = await getCallCurrentUser(context);

  if (!currentUser) {
    return { error: true, message: 'current-user-empty' };
  }

  const { message, postId, feedId } = data;

  // await setLastSeen(uid);

  const doc = await firestore
    .collection(`/feeds/${feedId}/posts/${postId}/comments`)
    .add({
      message: message.trim(),
      uid: currentUser.id,
      username: currentUser.username,
      userPhoto: currentUser.userPhoto,
      timestamp: new Date(),
      numLikesRecieved: 0,
    } as IPostComment);

  await firestore.collection(`/users/${currentUser.id}/actions`).add({
    type: 'commented',
    feedId,
    postId,
    commentId: doc.id,
  } as IUserAction);

  return {};
  // }

  // return {
  //   error: true,
  //   errorCode: 'logged-out',
  // };
}

export default functions.https.onCall(impl);
