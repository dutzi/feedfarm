import { IChatMessage } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

const firestore = admin.firestore();

export default async function getAllUserChats(id: string) {
  const chatDocs = await firestore
    .collection('/chats')
    .where('users', 'array-contains', id)
    .get();

  return chatDocs.docs.map(chatData => chatData.data()) as {
    messages: IChatMessage[];
  }[];
}
