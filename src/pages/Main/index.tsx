import React from 'react';
import styles from './index.module.scss';
import LinkButton from '../../components/LinkButton';
import { Trans, useTranslation } from 'react-i18next';
import CreateFeed from '../../components/CreateFeed';
import Button from '../../components/Button';

export default () => {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      <div className={styles.maxWidth}>
        <h1>{t('What?')}</h1>
        <div className={styles.paragraph}>
          <Trans i18nKey="home.description">
            Create your own feed using Feed Farm!
          </Trans>
        </div>
        <h1>
          <Trans i18nKey="home.howTitle">How?</Trans>
        </h1>
        <CreateFeed />
        <div className={styles.center}>
          <div>
            <Trans i18nKey="home.or">or</Trans>
          </div>
          <div className="margin-h-md" />
          <Button
            variant="ghost-muted"
            href="/f/feedfarm-example-feed"
            label={t('home.showExampleFeed', 'See Example Feed')}
          ></Button>
        </div>
      </div>
    </div>
  );
};
