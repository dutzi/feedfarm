import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
// import setLastSeen from '../utils/set-last-seen';

const firestore = admin.firestore();

const NUM_ATTRIBUTIONS = 10;

export async function impl(
  data: { postId: string; emojiId: string; feedId: string },
  context: functions.https.CallableContext,
) {
  // if (context.auth) {
  //   const uid = context.auth.uid;

  const { postId, emojiId, feedId } = data;

  // await setLastSeen(uid);

  const userIds = (
    await firestore
      .doc(`/feeds/${feedId}/posts/${postId}/reactions/${emojiId}`)
      .get()
  ).data()!.users as string[];

  const users = await Promise.all(
    userIds.slice(0, NUM_ATTRIBUTIONS).map((userId: string) => {
      return firestore.doc(`/users/${userId}`).get();
    }),
  );

  const usernames = users.map(user => user.data()!.username as string);

  return { usernames };

  // return {
  //   error: true,
  //   errorCode: 'logged-out',
  // };
}

export default functions.https.onCall(impl);
