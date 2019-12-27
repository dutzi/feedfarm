import * as admin from 'firebase-admin';

const firestore = admin.firestore();

export default async function isUsernameTaken(username: string) {
  const lCasedUsername = username.toLowerCase();

  // todo optimize - change to query
  const userDocs = await firestore
    .collection(`/users`)
    .where('lcasedUsername', '==', lCasedUsername)
    .get();

  // for (const userDoc of userDocs) {
  //   const user = (await userDoc.get()).data() as IUser;
  //   if (!user) {
  //     console.log('error reading', userDoc.id);
  //   }
  //   if (user.username && user.username.toLowerCase() === lCasedUsername) {
  //     return false;
  //   }
  // }

  return !userDocs.empty;
}
