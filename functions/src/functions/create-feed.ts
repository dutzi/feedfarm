import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IFeed, IUser, IBasicUser } from '../feedfarm-shared/types';
import { canonizeFeedName } from '../feedfarm-shared/utils';

const firestore = admin.firestore();

// todo fix this to work with guest users
export async function impl(
  data: { feedName: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;
    const { feedName } = data;

    const user = (await firestore.doc(`users/${uid}`).get()).data() as IUser;

    const feedExists = !(
      await firestore
        .collection(`/feeds/`)
        .where('name', '==', feedName)
        .get()
    ).empty;

    if (feedExists) {
      return {
        error: true,
        message: 'feed-exists',
      };
    }

    const basicOwner: IBasicUser = {
      uid,
      username: user.username,
      userPhoto: user.userPhoto,
    };

    const feed: IFeed = {
      id: 'temp-id',
      name: feedName,
      lcasedName: feedName.toLowerCase(),
      canonicalName: canonizeFeedName(feedName),
      design: {
        bgColor: '#000000',
        postBgColor: '#000000',
        textColor: '#000000',
        postTextColor: '#000000',
      },
      owners: [basicOwner],
      moderators: [],
      members: [],
      bannedUsers: [],
      allowsCommenting: true,
      allowsReactions: true,
      allowsTags: true,
      allowedFeedItemTypes: [
        'published-link',
        'published-poll',
        'published-post',
        'published-text-bomb',
        'user-joined',
      ],
      theme: 'default',
      whoCanRead: 'guest',
      whoCanWrite: 'guest',
      canReadUIDS: [],
    };

    const feedDoc = await firestore.collection(`/feeds/`).add(feed);

    await firestore
      .doc(`/feeds/${feedDoc.id}`)
      .set({ id: feedDoc.id } as IFeed, { merge: true });

    return {};
  }

  return {
    error: true,
    message: 'logged-out',
  };
}

export default functions.https.onCall(impl);
