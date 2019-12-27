import React from 'react';
import { TFeedItemType, IFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import TimeAgo from '../../../Notifications/partials/TimeAgo';
import { useTranslation } from 'react-i18next';
import ContextMenu, { TAction } from '../ContextMenu';
import useUserLink from '../../hooks/use-user-link';

export default function PostMetadata({
  item,
  isSticky,
  onContextMenuSelect,
  showContextMenuSpinner,
}: {
  item: IFeedItem;
  isSticky?: boolean;
  onContextMenuSelect: (action: TAction) => void;
  showContextMenuSpinner: boolean;
}) {
  const { t } = useTranslation();

  const userLink = useUserLink(item.username, item.uid);

  function getPostTypeDescription(type: TFeedItemType) {
    switch (type) {
      case 'published-link':
        return t('posted a link');
      case 'published-post':
        return t('published a post');
    }
  }

  return (
    <div className={styles.wrapper}>
      <span>
        {userLink} {getPostTypeDescription(item.type)}{' '}
        <TimeAgo className={styles.timestamp} timestamp={item.timestamp} />
      </span>
      {isSticky && <i className="fa fa-thumbtack" />}
      {!isSticky && (
        <ContextMenu
          feedItem={item}
          onClick={onContextMenuSelect}
          showSpinner={showContextMenuSpinner}
        />
      )}
    </div>
  );
}
