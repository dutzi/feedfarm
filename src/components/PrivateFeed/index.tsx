import React from 'react';
import styles from './index.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../Button';
import useCurrentUser from '../../hooks/use-current-user';
import { useTypedDispatch } from '../../state/reducer';

export default function PrivateFeed() {
  const { t } = useTranslation();
  const [currentUser] = useCurrentUser();
  const dispatch = useTypedDispatch();

  function handleRequestAccess() {
    if (currentUser?.isGuest) {
      dispatch({ type: 'open-signup-modal' });
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.border}>
        <div className={styles.inset}>
          <i className="fa fa-lock" />
          <div className={styles.title}>
            <Trans>This feed is private</Trans>
          </div>
          <div className="margin-h-lg"></div>
          {/* TODO - request access */}
          {/* <Button
            label={t('Request Access')}
            variant="ghost"
            onClick={handleRequestAccess}
          /> */}
        </div>
      </div>
    </div>
  );
}
