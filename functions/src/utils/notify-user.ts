import { INotification } from '../feedfarm-shared/types';
import modifyUser from './modify-user';
import { ADMIN_UID } from './consts';
// const uuidv1 = require('uuid/v1');

export default async function notifyUser(
  uid: string,
  notification: Pick<INotification, 'type' | 'sourceUid' | 'payload'>,
  dedupeStrat: 'same' | 'last' = 'same',
) {
  if (notification.sourceUid === ADMIN_UID) {
    return;
  }

  await modifyUser(uid, user => {
    // user.notifications = user.notifications || [];
    // const last = user.notifications[user.notifications.length - 1];
    // if (
    //   (dedupeStrat === 'same' &&
    //     user.notifications.find(
    //       userNotification =>
    //         userNotification.sourceUid === notification.sourceUid &&
    //         userNotification.type === notification.type,
    //     )) ||
    //   (dedupeStrat === 'last' &&
    //     last &&
    //     last.sourceUid === notification.sourceUid &&
    //     last.type === notification.type)
    // ) {
    //   return;
    // }
    // user.notifications.push({
    //   id: uuidv1(),
    //   ...notification,
    //   timestamp: new Date(),
    //   read: false,
    // });
  });
}
