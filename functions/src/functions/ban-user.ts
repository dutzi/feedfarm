import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import getUserRoles from '../utils/get-user-roles';
import { IUser, IBasicUser, IFeed } from '../feedfarm-shared/types';
// import setLastSeen from '../utils/set-last-seen';

const firestore = admin.firestore();

export async function impl(
  data: { uid: string; feedId: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const { uid: targetUID, feedId } = data;

    const roles = await getUserRoles({ uid, feedId });

    // await setLastSeen(uid);

    if (roles.feedOwner || roles.feedModerator || roles.superAdmin) {
      const userToBan = (
        await firestore.doc(`/users/${targetUID}`).get()
      ).data() as IUser;

      await firestore.doc(`/feeds/${feedId}`).set(
        {
          bannedUsers: [
            {
              uid: userToBan.id,
              username: userToBan.username,
              userPhoto: userToBan.userPhoto,
            } as IBasicUser,
          ],
        } as IFeed,
        { merge: true },
      );
    }

    return {};
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
