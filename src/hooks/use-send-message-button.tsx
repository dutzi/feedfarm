import React, { useState } from 'react';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import SendMessageModal from '../components/SendMessageModal';
import { IPublicUser } from '@feedfarm-shared/types';
import { useTranslation } from 'react-i18next';
import useCurrentUser from './use-current-user';

export default function useSendMessageButton(
  toUser: IPublicUser | undefined | null,
  render?: (onClick: () => void) => JSX.Element,
): [
  (params?: { minimizeOnMobile?: boolean | undefined }) => JSX.Element,
  (props?: { placeholder?: string }) => JSX.Element | null,
] {
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currentUser] = useCurrentUser();

  function handleSendMessage() {
    if (!currentUser) {
      dispatch({ type: 'open-signup-modal' });
      return;
    }

    setShowSendMessageModal(true);
  }

  function handleCloseSendMessageModal() {
    setShowSendMessageModal(false);
  }

  function renderButton({
    minimizeOnMobile,
  }: { minimizeOnMobile?: boolean } = {}) {
    if (render) {
      return render(handleSendMessage);
    }

    return (
      <Button
        icon="fa fa-comments"
        label={t('Send Message')}
        variant="ghost"
        size="sm"
        onClick={handleSendMessage}
        minimizeOnMobile={minimizeOnMobile}
      />
    );
  }

  function renderModal({ placeholder }: { placeholder?: string } = {}) {
    if (!toUser) {
      return null;
    }

    return (
      <SendMessageModal
        show={showSendMessageModal}
        toUser={toUser}
        onClose={handleCloseSendMessageModal}
        placeholder={placeholder}
      />
    );
  }

  return [renderButton, renderModal];
}
