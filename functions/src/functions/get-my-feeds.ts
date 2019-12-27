// import { IPublicUser, IUser } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IBasicUser, IFeed, IUser, TUserRole } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export async function impl(
  data: void,
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const sourceUID = context.auth.uid;

    const currentUser = (
      await firestore.doc(`/users/${sourceUID}`).get()
    ).data() as IUser;

    const feedsByRole: { [key in TUserRole]: IFeed[] } = {
      owners: [],
      moderators: [],
      members: [],
    };

    const basicUser: IBasicUser = {
      uid: currentUser.id,
      username: currentUser.username,
      userPhoto: currentUser.userPhoto,
    };

    const roles: TUserRole[] = ['owners', 'moderators', 'members'];

    const promises = roles.map(role => {
      return firestore
        .collection('feeds')
        .where(role, 'array-contains', basicUser)
        .get();
    });

    let numFeeds = 0;

    const result = await Promise.all(promises);

    const newFeedsByRole = result.reduce((prev, current, index) => {
      numFeeds += result[index].docs.length;
      return {
        ...prev,
        [roles[index]]: result[index].docs.map(feed => feed.data() as IFeed),
      };
    }, feedsByRole);

    return { numFeeds, feedsByRole: newFeedsByRole };
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
