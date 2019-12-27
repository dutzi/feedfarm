import * as admin from 'firebase-admin';

import produce from 'immer';

const firestore = admin.firestore();
export default async function modifyDoc<T>(
  documentPath: string,
  callback: (draftState: T) => void,
) {
  const docRef = firestore.doc(documentPath);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.error('doc-does-not-exist', documentPath);
    return;
  }

  let data: T = doc.data() as T;

  data = produce(data, callback);

  await docRef.set(data);
}
