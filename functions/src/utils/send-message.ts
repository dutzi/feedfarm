import { IChatMessage } from '../feedfarm-shared/types';
import * as admin from 'firebase-admin';

const firestore = admin.firestore();

async function getUserChat(uid1: string, uid2: string) {
  const chatA = firestore.doc(`/chats/${uid1}-${uid2}`);

  const chatB = firestore.doc(`/chats/${uid2}-${uid1}`);

  const [chatAData, chatBData] = await Promise.all([chatA.get(), chatB.get()]);
  if (!chatBData.exists) {
    return { chatDocRef: chatA, chatData: chatAData.data() };
  } else {
    return { chatDocRef: chatB, chatData: chatBData.data() };
  }
}

export default async function sendMessage({
  message,
  imageUrl,
  targetUid,
  sourceUid,
}: {
  message?: string;
  imageUrl?: string;
  targetUid: string;
  sourceUid: string;
}) {
  const userChat = await getUserChat(sourceUid, targetUid);

  const messageObj: IChatMessage = {
    from: sourceUid,
    read: false,
    timestamp: new Date(),
  };

  if (message) {
    messageObj.message = message;
  }

  if (imageUrl) {
    messageObj.imageUrl = imageUrl;
  }

  await userChat.chatDocRef.set({
    messages: [
      ...(((userChat.chatData || {}).messages || []) as IChatMessage[]),
      messageObj,
    ],
    users: (userChat.chatData || {}).users || [sourceUid, targetUid],
    lastMessageTimestamp: messageObj.timestamp,
  });
}
