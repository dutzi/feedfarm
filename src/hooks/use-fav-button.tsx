import React from 'react';
import useFavUser from './use-fav-user';
import { useDispatch } from 'react-redux';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import useCurrentUser from './use-current-user';

export default function useFavButton(
  id: string,
  showToast: (message: string) => void,
  setUndoHandler: (callback: () => void) => void,
) {
  const [favUser, unFavUser, isFaved, isProcessingFavs] = useFavUser(id);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currentUser] = useCurrentUser();

  async function handleToggleFavs() {
    if (!currentUser) {
      dispatch({ type: 'open-signup-modal' });
      return;
    }

    let toastMessage: string;

    if (!isFaved) {
      await favUser();
      toastMessage = t('Added to favorites');
      setUndoHandler(unFavUser);
    } else {
      await unFavUser();
      toastMessage = t('Removed from favorites');
      setUndoHandler(favUser);
    }

    showToast(toastMessage);
  }

  function render({ minimizeOnMobile }: { minimizeOnMobile?: boolean } = {}) {
    return (
      <Button
        icon="fa fa-heart"
        label={isFaved ? t('Unfav') : t('Fav')}
        highlightIcon={isFaved}
        variant="ghost"
        size="sm"
        onClick={handleToggleFavs}
        showSpinner={isProcessingFavs}
        minimizeOnMobile={minimizeOnMobile}
      />
    );
  }

  return render;
}
