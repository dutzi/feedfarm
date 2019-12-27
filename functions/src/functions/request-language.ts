import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ADMIN_UID } from '../utils/consts';

const firestore = admin.firestore();

export async function impl(
  data: { languageCode: string },
  context: functions.https.CallableContext,
) {
  if (context.auth) {
    if (context.auth.uid === ADMIN_UID) {
      return;
    }
  }

  const requestedLanguages =
    (await firestore.doc(`/requests/languages`).get()).data() || {};

  const language = data.languageCode;
  const count = requestedLanguages[language] || 0;

  await firestore.doc(`/requests/languages`).set(
    {
      ...requestedLanguages,
      [language]: count + 1,
    },
    { merge: true },
  );

  return {};
}

export default functions.https.onCall(impl);
