import React from 'react';
import styles from './index.module.scss';
import TimeAgo from '../../../Notifications/partials/TimeAgo';
import { IPostComment } from '@feedfarm-shared/types';
import useUserLink from '../../hooks/use-user-link';
import UserPhoto from '../../../../components/UserPhoto';

export default function Comment({
  id,
  data,
}: {
  id: string;
  data: IPostComment;
}) {
  const userLink = useUserLink(data.username, data.uid);

  return (
    <div className={styles.wrapper}>
      <UserPhoto
        className={styles.userPhoto}
        photo={data.userPhoto}
        size="sm"
      />
      <div>
        {userLink} <span className={styles.message}>{data.message}</span>
        <div>
          <TimeAgo className={styles.timestamp} timestamp={data.timestamp} />
        </div>
      </div>
    </div>
  );
}
