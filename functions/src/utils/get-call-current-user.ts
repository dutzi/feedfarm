import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { IUser } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export default async function getCallCurrentUser(
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    return (
      await firestore.doc(`/users/${context.auth.uid}`).get()
    ).data() as IUser;
  } else {
    throw new Error('user-logged-out');
  }
}
