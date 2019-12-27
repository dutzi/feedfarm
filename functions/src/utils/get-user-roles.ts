import * as admin from 'firebase-admin';
import { SYSTEM_ADMIN_UID } from '../feedfarm-shared/utils';
import { IFeed, IFeedItem } from '../feedfarm-shared/types';

const firestore = admin.firestore();

interface IUserRolesMap {
  postAuthor?: boolean;
  superAdmin?: boolean;
  feedOwner?: boolean;
  feedModerator?: boolean;
}

export default async function getUserRoles({
  uid,
  postId,
  feedId,
}: {
  uid: string;
  postId?: string;
  feedId?: string;
}) {
  const roles: IUserRolesMap = {};

  roles.superAdmin = uid === SYSTEM_ADMIN_UID;

  if (feedId) {
    const feed = (
      await firestore.doc(`/feeds/${feedId}`).get()
    ).data()! as IFeed;
    roles.feedOwner = !!feed.owners.find(user => user.uid === uid);
    roles.feedModerator = !!feed.moderators.find(user => user.uid === uid);
  }

  if (postId && feedId) {
    const post = (
      await firestore.doc(`/feeds/${feedId}/posts/${postId}`).get()
    ).data()! as IFeedItem;
    roles.postAuthor = post.uid === uid;
  }

  return roles;
}
