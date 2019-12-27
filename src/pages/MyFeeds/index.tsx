import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { IFeed, TUserRole } from '@feedfarm-shared/types';
import useCurrentUser from '../../hooks/use-current-user';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import useProcessing from '../../hooks/use-processing';
import { getMyFeeds } from '../../firebase-functions';
import Spinner from '../../components/Spinner';

export default function MyFeeds() {
  const [currentUser] = useCurrentUser();
  const [feedsByRole, setFeedsByRole] = useState<
    { [key in TUserRole]: IFeed[] }
  >({
    owners: [],
    moderators: [],
    members: [],
  });
  const { t } = useTranslation();
  const [numFeeds, setNumFeeds] = useState(0);
  const processing = useProcessing(true);

  const titles: { [key in TUserRole]: string } = {
    owners: t('Owner'),
    moderators: t('Moderator'),
    members: t('Member'),
  };

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    getMyFeeds().then(response => {
      if ('error' in response) {
        return;
      }

      setFeedsByRole(response.feedsByRole);

      setNumFeeds(response.numFeeds);

      processing.stop();
    });
  }, [currentUser]);

  if (processing.state) {
    return <Spinner className={styles.spinner} size="lg" center />;
  }

  return (
    <div className={styles.wrapper}>
      <h1>
        <Trans i18nKey="myFeeds.count" count={numFeeds} values={{ numFeeds }}>
          You are a member of {{ numFeeds }} feeds:
        </Trans>
      </h1>
      {(Object.keys(feedsByRole) as TUserRole[]).map(role => (
        <div key={role}>
          <div className={styles.feeds}>
            {feedsByRole[role].map(feed => (
              <Link
                key={feed.id}
                className={styles.feed}
                to={`/f/${feed.canonicalName}`}
              >
                <div className={styles.name}>{feed.name}</div>
                <div className={styles.role}>{titles[role]}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
