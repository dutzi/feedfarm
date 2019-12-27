import groupBy from 'lodash.groupby';
import padStart from 'lodash.padstart';
import firebase from 'firebase/app';
import { IChatMessage } from '@feedfarm-shared/types';

function sortByDate(a: string, b: string) {
  var aa = new Date(a),
    bb = new Date(b);

  if (aa > bb) {
    return 1;
  }
  if (aa < bb) {
    return -1;
  } else return 0;
}

export function getLocaleDate(machineDate: string) {
  const splitMachineDate = machineDate.split('-');
  return `${splitMachineDate[1]}/${splitMachineDate[2]}/${splitMachineDate[0]}`;
}

export function groupMessages(chatMessages?: IChatMessage[]) {
  let sortedGroupedChatMessages: {
    date: string;
    messages: IChatMessage[];
  }[] = [];

  if (chatMessages) {
    const groupedChatMessages = groupBy(chatMessages, message => {
      const date = new Date(message.timestamp.seconds * 1000);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() +
        1}`;
    });

    const sortedDates = Object.keys(groupedChatMessages).sort(sortByDate);

    sortedGroupedChatMessages = sortedDates.map(date => ({
      date,
      messages: groupedChatMessages[date],
    }));
  }

  return sortedGroupedChatMessages;
}

export function getTime(timestamp: any) {
  const date = new Date(timestamp.seconds * 1000);
  return date.getHours() + ':' + padStart(date.getMinutes().toString(), 2, '0');
}

export function onChatSnaphot(
  currentUserId: string,
  id: string,
  callback: (x: IChatMessage[]) => void,
) {
  const unsubscribe1 = firebase
    .firestore()
    .doc(`chats/${id}-${currentUserId}`)
    .onSnapshot(snapshot => {
      if (snapshot.data()) {
        callback((snapshot.data() as any).messages);
      }
    });

  const unsubscribe2 = firebase
    .firestore()
    .doc(`chats/${currentUserId}-${id}`)
    .onSnapshot(snapshot => {
      if (snapshot.data()) {
        callback((snapshot.data() as any).messages);
      }
    });

  return () => {
    unsubscribe1();
    unsubscribe2();
  };
}
