import * as admin from 'firebase-admin';
const _ = require('lodash');
import getUserTags from './get-user-tags';
import getAsset from './get-asset';
import getPublicUser from './get-public-user';
import { IUser, IMatch } from '../feedfarm-shared/types';

const firestore = admin.firestore();

export default async function getUserAssets(uid: string) {
  const library = await firestore
    .collection(`/users/${uid}/library`)
    .listDocuments();

  const pastebin = await firestore
    .collection(`/users/${uid}/pastebin`)
    .listDocuments();

  const user = await firestore.doc(`/users/${uid}`).get();

  const tags = await getUserTags(uid);

  const matchingAssets = [
    ...(await Promise.all(library.map(doc => getAsset(doc.id)))),
    ...(await Promise.all(pastebin.map(doc => getAsset(doc.id)))),
  ];

  const uniqueMatchingAssets = _.uniqBy(
    matchingAssets,
    (asset: any) => asset.thumbnailUrl,
  );

  return {
    matchingAssets: uniqueMatchingAssets,
    matchingTags: tags.join(' '),
    matchingReactions: [],
    score: 0,
    user: getPublicUser(user.data() as IUser),
  } as IMatch;
}
