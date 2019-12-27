import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { getProfilePhoto } from '../../utils';

export default function UserAvatar({
  user,
  size = 32,
}: {
  user?: any;
  size?: number;
}) {
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfilePhoto(getProfilePhoto(user.photos));
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) return null;

  return (
    <div
      className={styles.wrapper}
      style={{ width: size + 'px', height: size + 'px' }}
    >
      {profilePhoto ? (
        <img className={styles.profilePhoto} src={profilePhoto} alt="User" />
      ) : (
        <i className={cx(styles.missingAvatar, 'fa fa-user')} />
      )}
    </div>
  );
}
