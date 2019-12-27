import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { useTranslation, Trans } from 'react-i18next';

export default function Toast({
  show,
  message,
  onUndo,
}: {
  show: boolean;
  message: string;
  onUndo: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className={cx(styles.wrapper, show && styles.show)}>
      <span>{message}</span>
      <button className={styles.textButton} onClick={onUndo}>
        {t('Undo')}
      </button>
    </div>
  );
}
