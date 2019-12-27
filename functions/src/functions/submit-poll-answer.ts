import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IUserAction } from '../feedfarm-shared/types';
// import setLastSeen from '../utils/set-last-seen';
// import {
//   IFeedItem,
//   IFeedItemLinkPayload,
//   IFeedItemPostPayload,
//   TFeedItemType,
//   IFeedItemPollPayload,
//   IFeedItemTextBombPayload,
//   IPublishedPollFeedItem,
// } from '../feedfarm-shared/types';
// import getCallCurrentUser from '../utils/get-call-current-user';

const firestore = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

export async function impl(
  data: { feedId: string; feedItemId: string; answerIndex: number },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const { feedId, feedItemId, answerIndex } = data;

    const numAnswers = (
      await firestore.doc(`/feeds/${feedId}/posts/${feedItemId}`).get()
    ).data()!.payload.answers.length;

    if (answerIndex < 0 || answerIndex >= numAnswers) {
      return {
        error: true,
        message: 'answer-index-out-of-bounds',
      };
    }

    const answers = await firestore
      .collection(`/feeds/${feedId}/posts/${feedItemId}/answers`)
      .get();

    const hasSubmittedAnswer = !!answers.docs.find(
      doc => doc.data().users.indexOf(uid) !== -1,
    );

    if (hasSubmittedAnswer) {
      return {
        error: true,
        message: 'user-submitted-answer',
      };
    }

    let newUsers: string[];

    if (answers.docs[answerIndex]) {
      newUsers = [...answers.docs[answerIndex].data().users, uid];
    } else {
      newUsers = [uid];
    }

    await firestore
      .doc(`/feeds/${feedId}/posts/${feedItemId}/answers/${answerIndex}`)
      .set({ users: newUsers });

    await firestore
      .doc(`/feeds/${feedId}/posts/${feedItemId}`)
      .update({ answerCount: FieldValue.increment(1) });

    const distribution = answers.docs.reduce(
      (prev, answerDoc) => ({
        ...prev,
        [answerDoc.id]: answerDoc.data().users.length,
      }),
      {} as { [key: string]: number },
    );

    // const distribution = answers.docs.map(
    //   answerDoc => answerDoc.data().users.length,
    // );

    distribution[answerIndex] = 1 + (distribution[answerIndex] || 0);

    await firestore.collection(`/users/${uid}/actions`).add({
      type: 'submitted-poll-answer',
      feedId,
      postId: feedItemId,
      answerId: String(answerIndex),
    } as IUserAction);

    return {
      distribution,
    };
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
