import * as admin from 'firebase-admin';
import { IUser } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export default async function setLastSeen(uid: string) {
  await firestore
    .doc(`/users/${uid}`)
    .set({ lastSeen: new Date() } as Partial<IUser>, { merge: true });
}
