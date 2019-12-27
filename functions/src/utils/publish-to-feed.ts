import {
  // IUserJoinedFeedItem,
  IFeedItem,
} from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

const firestore = admin.firestore();

export default async function publishToFeed(params: any): Promise<any>;

export default async function publishToFeed({
  type,
  uid,
  username,
  payload,
}: Omit<IFeedItem, 'timestamp' | 'reactions'>) {
  const feed = firestore.collection('/feed');

  // todo secure - check if last item is similar to current
  await feed.add({
    username,
    uid,
    type,
    payload,
    timestamp: new Date(),
  });
}
