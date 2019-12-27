import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
// import setLastSeen from '../utils/set-last-seen';

const firestore = admin.firestore();

export async function impl(
  data: { feedId: string; feedItemId: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const { feedId, feedItemId } = data;

    const answers = await firestore
      .collection(`/feeds/${feedId}/posts/${feedItemId}/answers`)
      .get();

    const hasSubmittedAnswer = !!answers.docs.find(
      doc => doc.data().users.indexOf(uid) !== -1,
    );

    if (hasSubmittedAnswer) {
      return {
        distribution: answers.docs.reduce(
          (prev, answerDoc) => ({
            ...prev,
            [answerDoc.id]: answerDoc.data().users.length,
          }),
          {},
        ),
      };
    } else {
      return {};
    }
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
