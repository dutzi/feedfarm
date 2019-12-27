import React from 'react';
import useFavUser from './use-fav-user';
import Button from '../components/Button';
import useCurrentUserId from './use-current-user-id';
import { isAdmin } from '../utils';
import { useTranslation, Trans } from 'react-i18next';

const googleUserId = window.localStorage.getItem('googleUserId') || '0';

export default function useViewUserInDBButton(id?: string) {
  const currentUserId = useCurrentUserId();
  const isCurrentUserAdmin = isAdmin(currentUserId);
  const { t } = useTranslation();

  function handleViewUserDB() {
    window.open(
      `https://console.firebase.google.com/u/${googleUserId}/project/feedfarm-app/database/firestore/data~2Fusers~2F${id}`,
    );
  }

  function render({
    margin,
    minimizeOnMobile,
  }: { margin?: boolean; minimizeOnMobile?: boolean } = {}) {
    if (isCurrentUserAdmin) {
      return (
        <>
          <Button
            variant="ghost"
            icon="fa fa-database"
            size="sm"
            label={t('View In DB')}
            onClick={handleViewUserDB}
            minimizeOnMobile={minimizeOnMobile}
          />
          {margin && <div className="margin-h-sm" />}
        </>
      );
    } else {
      return null;
    }
  }

  return render;
}
