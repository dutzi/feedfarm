import React from 'react';
import styles from './index.module.scss';
// import { IEnrichedNotification } from '@feedfarm-shared/types';
import UserDetails from '../UserDetails';
import useViewProfileButton from '../../../../hooks/use-view-profile-button';
import TimeAgo from '../TimeAgo';
import { useTranslation } from 'react-i18next';

export default function Viewed({ notification }: { notification: any }) {
  const { t } = useTranslation();
  const renderViewProfileButton = useViewProfileButton(
    notification.sourceUser.id,
  );

  return (
    <div className={styles.wrapper}>
      <UserDetails user={notification.sourceUser} />
      <div className={styles.content}>
        <div>{t('Viewed your profile')}</div>
        <TimeAgo timestamp={notification.timestamp} />
        <div className={styles.actions}>{renderViewProfileButton()}</div>
      </div>
    </div>
  );
}
