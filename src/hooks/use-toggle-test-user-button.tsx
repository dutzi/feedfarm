import React, { useState, useEffect } from 'react';
import { isAdmin } from '../utils';
import firebase from 'firebase/app';
import Button from '../components/Button';
import useProcessing from './use-processing';
import useCurrentUserId from './use-current-user-id';
import { useTranslation } from 'react-i18next';

export default function useToggleTestUserButton(uid?: string) {
  const currentUserId = useCurrentUserId();
  const processing = useProcessing();
  const [isTestUser, setIsTestUser] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUserId) {
      return firebase
        .firestore()
        .doc(`/users/${uid}`)
        .onSnapshot(userSnapshot => {
          setIsTestUser(userSnapshot.data()!.isTestUser);
        });
    }
  }, [currentUserId]);

  async function handleToggleTestUser() {
    processing.start();

    if (uid) {
      const userDoc = await firebase
        .firestore()
        .doc(`/users/${uid}`)
        .get();

      await firebase
        .firestore()
        .doc(`/users/${uid}`)
        .set({ isTestUser: !userDoc.data()!.isTestUser }, { merge: true });
    }

    processing.stop();
  }

  function render({ minimizeOnMobile }: { minimizeOnMobile?: boolean } = {}) {
    if (!isAdmin(currentUserId)) {
      return null;
    }

    return (
      <Button
        icon="fa fa-vial"
        label={isTestUser ? t('Set As Regular User') : t('Set As Test User')}
        highlightIcon={isTestUser}
        variant="ghost"
        size="sm"
        onClick={handleToggleTestUser}
        showSpinner={processing.state}
        minimizeOnMobile={minimizeOnMobile}
      />
    );
  }

  return render;
}
