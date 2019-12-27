import * as admin from 'firebase-admin';
import { IBasicUser, IUserAction } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export default async function updateAllUserInteractions(
  existingUID: string,
  newUser: IBasicUser,
) {
  const userActions = await firestore
    .collection(`/users/${existingUID}/actions`)
    .get();

  if (existingUID !== newUser.uid) {
    await Promise.all(
      userActions.docs.map(actionDoc => {
        return firestore
          .collection(`/users/${newUser.uid}/actions`)
          .add(actionDoc.data());
      }),
    );
  }

  const migrationPromises = userActions.docs
    .map(doc => doc.data() as IUserAction)
    .map(action => {
      if (action.type === 'published-to-feed') {
        const docPath = `/feeds/${action.feedId}/posts/${action.postId}`;
        return firestore
          .doc(docPath)
          .get()
          .then(doc => {
            if (doc.exists) {
              return firestore.doc(docPath).set(newUser, { merge: true });
            }
            return Promise.resolve(null);
          });
      }

      if (action.type === 'commented') {
        const docPath = `/feeds/${action.feedId}/posts/${action.postId}/comments/${action.commentId}`;
        return firestore
          .doc(docPath)
          .get()
          .then(doc => {
            if (doc.exists) {
              return firestore.doc(docPath).set(newUser, { merge: true });
            }
            return Promise.resolve(null);
          });
      }

      if (existingUID !== newUser.uid && action.type === 'reacted') {
        const docPath = `/feeds/${action.feedId}/posts/${action.postId}/reactions/${action.reactionId}`;

        return firestore
          .doc(docPath)
          .get()
          .then(reactionDoc => {
            const users = reactionDoc.data()!.users as string[];

            if (users.indexOf(existingUID) === -1) {
              return Promise.resolve(null);
            }

            users.splice(users.indexOf(existingUID), 1);

            return firestore
              .doc(docPath)
              .set({ users: [...users, newUser.uid] }, { merge: true });
          });
      }

      if (
        existingUID !== newUser.uid &&
        action.type === 'submitted-poll-answer'
      ) {
        const docPath = `/feeds/${action.feedId}/posts/${action.postId}/answers/${action.answerId}`;

        return firestore
          .doc(docPath)
          .get()
          .then(answersDoc => {
            const users = answersDoc.data()!.users as string[];

            if (users.indexOf(existingUID) === -1) {
              return Promise.resolve(null);
            }

            users.splice(users.indexOf(existingUID), 1);

            return firestore
              .doc(docPath)
              .set({ users: [...users, newUser.uid] }, { merge: true });
          });
      }

      return Promise.resolve(null);
    });

  return Promise.all(migrationPromises);
}
