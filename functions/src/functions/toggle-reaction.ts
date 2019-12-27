import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
// import setLastSeen from '../utils/set-last-seen';
import { IPostReaction, IUserAction } from '../feedfarm-shared/types';
import getCallCurrentUser from '../utils/get-call-current-user';
// import {
//   IUser,
//   IFeedItem,
//   IFeedItemLinkPayload,
//   IFeedItemPostPayload,
//   TFeedItemType,
// } from '../feedfarm-shared/types';

const firestore = admin.firestore();

async function updateReactions({
  myReactions,
  postReactions,
  emojiId,
  postId,
  feedId,
  uid,
}: {
  myReactions: string[];
  postReactions: IPostReaction[];
  emojiId: string;
  postId: string;
  feedId: string;
  uid: string;
}) {
  let newReactions;

  if (myReactions.indexOf(emojiId) > -1) {
    newReactions = postReactions
      .map(reaction =>
        reaction.type === emojiId
          ? { ...reaction, count: reaction.count - 1 }
          : reaction,
      )
      .filter(reaction => reaction.count > 0);
  } else {
    newReactions = postReactions.find(reaction => reaction.type === emojiId)
      ? postReactions.map(reaction =>
          reaction.type === emojiId
            ? { ...reaction, count: reaction.count + 1 }
            : reaction,
        )
      : [...postReactions, { type: emojiId, count: 1 }];
  }

  await firestore
    .doc(`/feeds/${feedId}/posts/${postId}`)
    .set({ reactions: newReactions }, { merge: true });
}

async function updateReactionsAttribution({
  myReactions,
  emojiId,
  postId,
  feedId,
  uid,
}: {
  myReactions: string[];
  emojiId: string;
  postId: string;
  feedId: string;
  uid: string;
}) {
  const reactionUsers = (
    await firestore
      .doc(`/feeds/${feedId}/posts/${postId}/reactions/${emojiId}`)
      .get()
  ).data() || { users: [] };

  if (myReactions.indexOf(emojiId) > -1) {
    reactionUsers.users.splice(reactionUsers.users.indexOf(uid), 1);
  } else {
    reactionUsers.users.push(uid);
  }

  await firestore
    .doc(`/feeds/${feedId}/posts/${postId}/reactions/${emojiId}`)
    .set(reactionUsers);
}

export async function impl(
  data: { emojiId: string; postId: string; feedId: string },
  context: functions.https.CallableContext,
) {
  const currentUser = await getCallCurrentUser(context);

  if (!currentUser) {
    return {
      error: true,
      message: 'no-user',
    };
  }

  const { emojiId, postId, feedId } = data;

  // await setLastSeen(currentUser.id);

  const myReactions = (
    await firestore
      .collection(`/feeds/${feedId}/posts/${postId}/reactions`)
      .where('users', 'array-contains', currentUser.id)
      .get()
  ).docs.map(doc => doc.id);

  const postReactions = ((
    await firestore.doc(`/feeds/${feedId}/posts/${postId}`).get()
  ).data()!.reactions || []) as IPostReaction[];

  await updateReactions({
    emojiId,
    feedId,
    postId,
    uid: currentUser.id,
    myReactions,
    postReactions,
  });

  await updateReactionsAttribution({
    emojiId,
    feedId,
    postId,
    uid: currentUser.id,
    myReactions,
  });

  await firestore.collection(`/users/${currentUser.id}/actions`).add({
    type: 'reacted',
    feedId,
    postId,
    reactionId: emojiId,
  } as IUserAction);

  return {};
}

export default functions.https.onCall(impl);
