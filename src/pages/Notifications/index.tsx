import React, { useEffect } from 'react';
import styles from './index.module.scss';
import firebase from 'firebase/app';
// import { IEnrichedNotification } from '@feedfarm-shared/types';
import useCallable from '../../hooks/use-callable';
import Faved from './partials/Faved';
import Viewed from './partials/Viewed';
// import useCurrentUser from '../../hooks/use-current-user';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import useImpersonatedUser from '../../hooks/use-impersonated-user';
import useContentSizer from '../../hooks/use-content-sizer';
import { useTranslation, Trans } from 'react-i18next';

function sortByDate(a: any, b: any) {
  return b.timestamp._seconds - a.timestamp._seconds;
}

export default function Notifications() {
  // const [currentUser] = useCurrentUser();
  const impersonatedUser = useImpersonatedUser();
  const { t } = useTranslation();
  const [wrapper] = useContentSizer();

  // const uid = (impersonatedUser || currentUser || {}).id;

  // const snapshotPath = uid ? `/users/${uid}` : undefined;

  // todo secure - why? or rather, what?
  const [notifications, isLoading] = useCallable<any[]>(
    'getNotifications',
    {
      interval: 10000,
      data: {
        impersonatedUid: impersonatedUser ? impersonatedUser.id : null,
      },
    },
    // {
    //   snapshotPath,
    //   data: {
    //     impersonatedUid: impersonatedUser ? impersonatedUser.id : null,
    //   },
    // },
  );

  useEffect(() => {
    firebase.functions().httpsCallable('markAllNotificationsAsRead')();
  }, [notifications && notifications.length]);

  function renderNotification(notification: any) {
    const props = { notification, key: notification.id };
    switch (notification.type) {
      case 'faved':
        return <Faved {...props} />;
      case 'viewed':
        return <Viewed {...props} />;
      default:
        return null;
    }
  }

  if (isLoading) {
    return (
      <div ref={wrapper} className={styles.wrapper}>
        <Spinner size="lg" center />
      </div>
    );
  }

  return (
    <div ref={wrapper} className={styles.wrapper}>
      {notifications && notifications.length ? (
        notifications.sort(sortByDate).map(renderNotification)
      ) : (
        <EmptyState
          title={t('No notifications')}
          emoji="🤷🏻‍♂️"
          emojiLabel={t('guy shrug')}
          subtitle=""
        />
      )}
    </div>
  );
}
