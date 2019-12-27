import React from 'react';
import {
  IFeedItem,
  IPublishedLinkFeedItem,
  IPublishedPostFeedItem,
} from '@feedfarm-shared/types';
import styles from './index.module.scss';
import useFeed from '../../../../hooks/use-feed';

export default function PostTags({ item }: { item: IFeedItem }) {
  const feed = useFeed();
  const tags =
    (item as IPublishedLinkFeedItem).payload.tags ||
    (item as IPublishedPostFeedItem).payload.tags;

  if (!feed?.allowsTags || !tags) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {tags.map(tag => (
        <div key={tag} className={styles.tag}>
          #{tag}
        </div>
      ))}
    </div>
  );
}
