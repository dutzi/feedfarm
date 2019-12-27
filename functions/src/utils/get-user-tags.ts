import * as admin from 'firebase-admin';

// admin.initializeApp();

const firestore = admin.firestore();

export function parseTags(tags: string) {
  return tags.trim().length === 0
    ? []
    : tags
        .split(' ')
        .filter(tag => tag.trim() !== '')
        .map(parseTag);
}

export function parseTag(tag: string) {
  const trimmedTag = tag.trim();
  return trimmedTag.startsWith('#') ? trimmedTag.substring(1) : trimmedTag;
}

export default async function getUserTags(uid: string) {
  const tags = await firestore.doc(`users/${uid}/match/tags`).get();

  if (tags.exists) {
    return tags.data()!.data as string[];
  } else {
    return [];
  }
}
