import React from 'react';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';

export default function Faved({
  notification,
}: {
  notification: any;
}) {
  const { t } = useTranslation();

  return <div className={styles.wrapper}>{t('Someone faved you!')}</div>;
}
