import React from 'react';
import firebase from 'firebase/app';
import styles from './index.module.scss';
import EditProfile from '../EditProfile';
import Button from '../../components/Button';
import { useTranslation } from 'react-i18next';
import EditCredentials from '../../components/EditCredentials';

export default function MyProfile({ uid }: { uid: string }) {
  const { t } = useTranslation();

  function handleSignout() {
    window.location.href = '/';
    firebase.auth().signOut();
  }

  return (
    <div className={styles.wrapper}>
      <EditCredentials uid={uid} />
      <EditProfile mode="edit" />
      <div className="margin-h-md" />
      <div className={styles.actions}>
        <Button label={t('Sign out')} variant="ghost" onClick={handleSignout} />
      </div>
    </div>
  );
}
