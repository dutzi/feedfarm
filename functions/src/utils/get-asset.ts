import * as admin from 'firebase-admin';

// admin.initializeApp();

const firestore = admin.firestore();

export default async function getAsset(id: string) {
  return (await firestore.doc(`/videos/${id}`).get()).data();
}
