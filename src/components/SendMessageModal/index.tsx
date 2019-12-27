import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.scss';
import cx from 'classnames';
import Modal from '../Modal';
import Button from '../Button';
import { IPublicUser } from '@feedfarm-shared/types';
import UserAvatar from '../UserAvatar';
import { sendMessage } from '../../utils';
import useEscapeToClose from '../../hooks/use-escape-to-close';
import { useTranslation, Trans } from 'react-i18next';

export default function SendMessageModal({
  onClose,
  toUser,
  show,
  placeholder,
}: {
  onClose: () => void;
  toUser: IPublicUser;
  show: boolean;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const [isSentMessage, setIsSentMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  useEscapeToClose(onClose);
  const { t } = useTranslation();

  useEffect(() => {
    if (show && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [show]);

  async function handleSubmit() {
    if (!message.trim()) {
      return;
    }

    setIsProcessing(true);

    await sendMessage({ message, targetUid: toUser.id });

    setIsProcessing(false);

    showDoneAndClose();
  }

  function showDoneAndClose() {
    setIsSentMessage(true);

    setTimeout(() => {
      onClose();
      setIsSentMessage(false);
      setMessage('');
    }, 1000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 13) {
      handleSubmit();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  if (!show) {
    return null;
  }

  return ReactDOM.createPortal(
    <Modal show={show} onClose={onClose}>
      <div
        className={cx(styles.wrapper, isSentMessage && styles.showSentMessage)}
      >
        <div className={styles.form}>
          <div className={styles.userDetails}>
            <UserAvatar user={toUser} />
            <div className="margin-v-sm" />
            <span>{toUser.username}</span>
          </div>
          <textarea
            placeholder={placeholder || t('Be respectful.')}
            ref={textareaRef}
            onChange={handleChange}
            value={message}
            className={styles.textarea}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.actions}>
            <Button
              label={t('Cancel')}
              size="sm"
              variant="ghost"
              onClick={onClose}
            />
            <div className="margin-v-sm" />
            <Button
              label={t('Send')}
              size="sm"
              variant="secondary"
              onClick={handleSubmit}
              showSpinner={isProcessing}
            />
          </div>
        </div>
        <div className={styles.okMessage}>{t('Message Sent!')}</div>
      </div>
    </Modal>,
    document.querySelector('#modal')!,
  );
}
