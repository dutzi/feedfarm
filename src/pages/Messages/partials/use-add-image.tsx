import React, { useState, useEffect } from 'react';
import styles from '../index.module.scss';
import Button from '../../../components/Button';
import useProcessing from '../../../hooks/use-processing';
import { uploadFile } from '../../../utils';
import { useTranslation } from 'react-i18next';

export default function useAddImage(): [
  () => JSX.Element,
  ({ onSend }: { onSend: (url: string) => void }) => JSX.Element | null,
] {
  const [url, setUrl] = useState<string>();
  const { t } = useTranslation();
  const processing = useProcessing();

  async function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      processing.start();
      const url = await uploadFile(e.target.files[0]);
      setUrl(url);
      processing.stop();
    }
  }

  function renderImagePreview({ onSend }: { onSend: (url: string) => void }) {
    function handleCancel() {
      setUrl(undefined);
    }

    function handleSend() {
      onSend(url!);
      setUrl(undefined);
    }

    if (url) {
      return (
        <div className={styles.imagePreviewOuterWrapper}>
          <div className={styles.imagePreviewWrapper}>
            <img className={styles.imagePreview} src={url} />
          </div>
          <div className={styles.actions}>
            <div />
            <Button
              label={t('Cancel')}
              variant="ghost"
              onClick={handleCancel}
            />
            <Button label={t('Send')} variant="ghost" onClick={handleSend} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  function renderButton() {
    return (
      <Button
        variant="ghost"
        icon="fa fa-image"
        isUploadFile
        onChange={handleAddImage}
        showSpinner={processing.state}
        showNewBadge
      />
    );
  }

  return [renderButton, renderImagePreview];
}
