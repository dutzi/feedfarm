import { generateUserPhoto } from '../feedfarm-shared/utils';
// import { IPublicUser, IUser } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
import { IBasicUser, IUser } from '../feedfarm-shared/types';
// import notifyUser from '../utils/notify-user';
// import { ADMIN_UID } from '../utils/consts';
// import setLastSeen from '../utils/set-last-seen';
// import { isPremium } from '../feedfarm-shared/utils';

const firestore = admin.firestore();

export async function impl(
  data: { email: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    const email = data.email;

    const existingUserByEmail = await firestore
      .collection('/users')
      .where('email', '==', email)
      .get();

    const existingUserByName = await firestore
      .collection('/users')
      .where('username', '==', email)
      .get();

    if (!existingUserByEmail.empty || !existingUserByName.empty) {
      const user = existingUserByEmail.empty
        ? (existingUserByName.docs[0].data() as IBasicUser)
        : (existingUserByEmail.docs[0].data() as IUser);

      const basicUser: IBasicUser = {
        uid: (user as IUser).id || (user as IBasicUser).uid, // todo - fix this!
        username: user.username,
        userPhoto: user.userPhoto,
      };

      return basicUser;
    }

    const basicUser: IBasicUser = {
      uid: '',
      userPhoto: generateUserPhoto(),
      username: email,
    };

    const userDoc = await firestore.collection(`/users`).add(basicUser);

    await userDoc.set(
      {
        uid: userDoc.id,
      } as IBasicUser,
      { merge: true },
    );

    return {
      ...basicUser,
      uid: userDoc.id,
    } as IBasicUser;
  }

  return {
    error: true,
    errorCode: 'logged-out',
  };
}

export default functions.https.onCall(impl);
