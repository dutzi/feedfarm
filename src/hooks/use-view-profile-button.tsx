import React from 'react';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import useCurrentUser from './use-current-user';
import { ADMIN_UID } from '../utils';
import { useTranslation } from 'react-i18next';

export default function useViewProfileButton(uid?: string) {
  const dispatch = useDispatch();
  const [currentUser] = useCurrentUser();
  const { t } = useTranslation();

  function handleViewProfile() {
    if (currentUser) {
      dispatch({ type: 'open-profile', payload: { uid } });
    } else {
      dispatch({ type: 'open-signup-modal' });
    }
  }

  return ({
    disabled,
    minimizeOnMobile,
  }: { disabled?: boolean; minimizeOnMobile?: boolean } = {}) => {
    if (uid === ADMIN_UID) {
      return null;
    }

    return (
      <Button
        icon="fa fa-user"
        label={t('View Profile')}
        variant="ghost"
        size="sm"
        onClick={handleViewProfile}
        disabled={disabled}
        minimizeOnMobile={minimizeOnMobile}
      />
    );
  };
}
