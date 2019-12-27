import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
// import setLastSeen from '../utils/set-last-seen';
import {
  IFeedItem,
  IFeedItemLinkPayload,
  IFeedItemPostPayload,
  TFeedItemType,
  IFeedItemPollPayload,
  IFeedItemTextBombPayload,
  IPublishedPollFeedItem,
  IFeed,
  IUserAction,
} from '../feedfarm-shared/types';
import getCallCurrentUser from '../utils/get-call-current-user';

const firestore = admin.firestore();

export async function impl(
  data: {
    type: TFeedItemType;
    payload:
      | IFeedItemLinkPayload
      | IFeedItemPostPayload
      | IFeedItemPollPayload
      | IFeedItemTextBombPayload;
    feedId: string;
  },
  context: functions.https.CallableContext,
) {
  const currentUser = await getCallCurrentUser(context);

  if (!currentUser) {
    return {
      error: true,
      message: 'current-user-empty',
    };
  }

  const { payload, type, feedId } = data;

  const feed = (await firestore.doc(`/feeds/${feedId}`).get()).data() as IFeed;

  if (feed.allowedFeedItemTypes.indexOf(type) === -1) {
    return { error: true, message: 'feed-item-type-not-allowed' };
  }

  if (
    [
      'user-joined',
      'added-to-library',
      'published-link',
      'published-post',
      'published-poll',
      'published-text-bomb',
    ].indexOf(type) === -1
  ) {
    return {};
  }

  // await setLastSeen(uid);
  const feedItem: IFeedItem = {
    username: currentUser.username,
    uid: currentUser.id,
    userPhoto: currentUser.userPhoto,
    payload,
    type,
    timestamp: new Date(),
    reactions: [],
  };

  if (type === 'published-poll') {
    (feedItem as IPublishedPollFeedItem).answerCount = 0;
  }

  const doc = await firestore
    .collection(`/feeds/${feedId}/posts`)
    .add(feedItem);

  await firestore.collection(`/users/${currentUser.id}/actions`).add({
    type: 'published-to-feed',
    feedId,
    postId: doc.id,
  } as IUserAction);

  return {};

  // return {
  //   error: true,
  //   errorCode: 'logged-out',
  // };
}

export default functions.https.onCall(impl);
