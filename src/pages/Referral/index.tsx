import React from 'react';
import styles from './index.module.scss';
import Input from '../../components/Input';
import useCurrentUser from '../../hooks/use-current-user';
import { Trans } from 'react-i18next';

export default function Referral() {
  const [currentUser] = useCurrentUser();

  return (
    <div className={styles.wrapper}>
      <div>
        <Trans i18nKey="referral.title">
          Get your friends to sign up with this unique URL:
        </Trans>
      </div>
      <div className="margin-h-lg" />
      <Input
        value={`${window.location.protocol}//${
          window.location.host
        }/r/${currentUser && currentUser.referrerId}`}
        fullWidth
        size="lg"
        readOnly
        copyButton
        autoFocus
      />
      <p>
        <Trans i18nKey="referral.body1">
          Once they become active you will get 2 weeks of free Feed Farm Gold!
        </Trans>
      </p>
      <p>
        <Trans i18nKey="referral.body2">
          An active account is one that has:
        </Trans>
      </p>
      <ol>
        <li>
          <Trans i18nKey="referral.active1">Set a profile photo</Trans>
        </li>
        <li>
          <Trans i18nKey="referral.active2">Matched with 2 other people</Trans>
        </li>
      </ol>
    </div>
  );
}
