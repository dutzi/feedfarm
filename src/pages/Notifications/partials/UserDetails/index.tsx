import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './index.module.scss';
// import { TBasicUser } from '@feedfarm-shared/types';
import UserAvatar from '../../../../components/UserAvatar';

export default function UserDetails({ user }: { user: any }) {
  const dispatch = useDispatch();

  function handleClick(e: React.MouseEvent) {
    dispatch({ type: 'open-profile', payload: { uid: user.id } });
  }

  return (
    <a
      href="#open-user-profile"
      className={styles.wrapper}
      onClick={handleClick}
    >
      <div className={styles.profilePhoto}>
        <UserAvatar user={user} size={40} />
      </div>
      <div className={styles.username}>{user.username}</div>
    </a>
  );
}
