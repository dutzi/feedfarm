import * as admin from 'firebase-admin';
const _ = require('lodash');
import getUserTags from './get-user-tags';
import getAsset from './get-asset';
import getPublicUser from './get-public-user';
import { IUser, IMatch, IReactionsMap } from '../feedfarm-shared/types';
import getVideoReactions from './get-video-reactions';
import createLogger from './performance-logger';

const firestore = admin.firestore();

type TIdsArray = { id: string }[];

export function createGuestUserData({
  tags,
  reactions,
}: {
  tags: TIdsArray;
  reactions: IReactionsMap;
}): Promise<[TIdsArray, TIdsArray, string[], IReactionsMap]> {
  return Promise.resolve([[], [], tags.map(({ id }) => id), reactions]);
}

export function getUserData(
  uid: string,
  logger?: ReturnType<typeof createLogger>,
) {
  const measurePromise = logger
    ? logger.measurePromise
    : <T>(message: string, x: Promise<T>) => x;

  return Promise.all(
    // prettier-ignore
    [
      measurePromise(`/users/${uid}/library`, firestore.collection(`/users/${uid}/library`).listDocuments() as Promise<TIdsArray>),
      measurePromise(`/users/${uid}/pastebin`, firestore.collection(`/users/${uid}/pastebin`).listDocuments() as Promise<TIdsArray>),
      measurePromise(`getUserTags(${uid})`, getUserTags(uid)),
      measurePromise(`getVideoReactions(${uid})`, getVideoReactions(uid)),
    ],
  );
}

export default async function getUsersMatch(
  currentUserUid: string,
  user1DataPromisesOrUid: ReturnType<typeof getUserData> | string,
  uid2: string,
) {
  const logger = createLogger('get-users-match-func', currentUserUid);

  const [
    library1,
    pastebin1,
    tags1,
    videoReactions1,
  ] = await (typeof user1DataPromisesOrUid === 'string'
    ? getUserData(user1DataPromisesOrUid, logger)
    : user1DataPromisesOrUid);

  const [library2, pastebin2, tags2, videoReactions2] = await getUserData(
    uid2,
    logger,
  );

  const user2 = await firestore.doc(`/users/${uid2}`).get();

  logger.log('fetch big chunk');

  const matchingReactions = Object.keys(videoReactions1)
    .filter(videoId => videoReactions1[videoId] === videoReactions2[videoId])
    .map(videoId => ({
      id: videoId,
      reaction: videoReactions1[videoId],
    }));

  const numMatchingReactions = matchingReactions.length;

  const libraryMatches = library1.filter(asset1 => {
    return library2.find(asset2 => asset1.id === asset2.id);
  });

  const pastebinMatches = pastebin1.filter(asset1 => {
    return pastebin2.find(asset2 => asset1.id === asset2.id);
  });

  logger.log('filter stuff out');

  const matchingAssets = [
    ...(await Promise.all(libraryMatches.map(doc => getAsset(doc.id)))),
    ...(await Promise.all(pastebinMatches.map(doc => getAsset(doc.id)))),
  ];

  logger.log('fetch all matching assets');

  const uniqueMatchingAssets = _.uniqBy(
    matchingAssets,
    (asset: any) => asset.thumbnailUrl,
  );

  const matchingTags = tags1.filter(tag1 => {
    return tags2.find(tag2 => tag1 === tag2);
  });

  logger.log('uniq and filter');

  logger.end();

  return {
    matchingAssets: uniqueMatchingAssets,
    matchingTags: matchingTags.join(' '),
    matchingReactions,
    score:
      numMatchingReactions * 5 +
      uniqueMatchingAssets.length * 5 +
      matchingTags.length,
    user: getPublicUser(user2.data() as IUser),
  } as IMatch;
}
