// import { IPublicUser, IUser } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IGuestUser } from '../feedfarm-shared/types';
const uuidv1 = require('uuid/v1');
// import notifyUser from '../utils/notify-user';
// import { ADMIN_UID } from '../utils/consts';
// import setLastSeen from '../utils/set-last-seen';
// import { isPremium } from '../feedfarm-shared/utils';

const firestore = admin.firestore();

export async function impl(
  data: { user: IGuestUser },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const uid = context.auth.uid;

    const user = data.user;

    user.isGuest = true;
    user.id = uid;
    user.token = uuidv1();
    // await setLastSeen(sourceUid);

    await firestore.doc(`/users/${uid}`).create(user);

    return {
      uid,
      token: user.token,
    };
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
