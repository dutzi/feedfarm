import React, { useState } from 'react';
import styles from './index.module.scss';
import Button from '../Button';
import { Trans, useTranslation } from 'react-i18next';
import Input from '../Input';
import { canonizeFeedName } from 'feedfarm-shared/utils';
import useProcessing from '../../hooks/use-processing';
import { useHistory } from 'react-router';
import { createFeed } from '../../firebase-functions';

export default function CreateFeed() {
  const [feedName, setFeedName] = useState(
    'My Awesome Feed ' + Math.floor(Math.random() * 1000),
  );
  const processing = useProcessing();
  const history = useHistory();
  const canonicalFeedName = canonizeFeedName(feedName);
  const { t } = useTranslation();

  const [nameTakenError, setNameTakenError] = useState(false);

  async function handleCreateFeedClick(e?: React.MouseEvent | React.FormEvent) {
    e?.preventDefault();

    if (!canonicalFeedName) {
      return;
    }

    processing.start();
    const response = await createFeed({ feedName });
    if (response.error) {
      if (response.message === 'feed-exists') {
        setNameTakenError(true);
      }
      processing.stop();
    } else {
      setTimeout(() => {
        history.push(`/f/${canonicalFeedName}`);
      }, 1000);
    }
  }

  return (
    <form className={styles.wrapper} onSubmit={handleCreateFeedClick}>
      <div className={styles.paragraph}>
        <Trans i18nKey="home.how1">
          First, let's pick a fancy name for your feed:
        </Trans>
        <div className="margin-h-md" />
        <Input
          fullWidth
          value={feedName}
          onValueChange={setFeedName}
          size="lg"
          autoFocus
        />
        <div className="margin-h-md" />
        <a
          className={styles.feedLink}
          href={`/f/${canonicalFeedName}`}
          onClick={handleCreateFeedClick}
        >
          https://feed.farm/f/{canonicalFeedName}
        </a>
      </div>
      {nameTakenError && (
        <div className={styles.error}>
          <Trans i18nKey="home.nameTaken">
            Feed name was already taken, try another?
          </Trans>
        </div>
      )}
      <div className={styles.signupForm}>
        <Button
          testId="tags"
          variant="secondary"
          label={t('home.letsGo', 'Create Feed!')}
          onClick={handleCreateFeedClick}
          size="lg"
          showSpinner={processing.state}
          disabled={!canonicalFeedName}
        ></Button>
        <div className="margin-h-sm" />
      </div>
    </form>
  );
}
