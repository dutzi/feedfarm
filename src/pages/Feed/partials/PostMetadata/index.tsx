import React from 'react';
import { TFeedItemType, IFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import TimeAgo from '../../../Notifications/partials/TimeAgo';
import ContextMenu, { TAction } from '../ContextMenu';
import useUserLink from '../../hooks/use-user-link';
import { usePostContextMenuItems } from '../Post/use-post-context-menu-items';
import { useTranslation } from 'react-i18next';

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
  const postContextMenuItems = usePostContextMenuItems({ feedItem: item });

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
          items={postContextMenuItems}
          onClick={onContextMenuSelect}
          showSpinner={showContextMenuSpinner}
        />
      )}
    </div>
  );
}
