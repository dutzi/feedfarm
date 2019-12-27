import * as admin from 'firebase-admin';
import { IReactionsMap } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export default async function getVideoReactions(uid: string) {
  const videos = await firestore.doc(`/users/${uid}/match/reactions`).get();
  if (videos.exists) {
    return (videos.data()!.data as IReactionsMap) || {};
  } else {
    return {};
  }
}
