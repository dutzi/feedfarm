import React from 'react';
import {
  IFeedItem,
  IPublishedLinkFeedItem,
  IPublishedPostFeedItem,
  IPublishedPollFeedItem,
} from '@feedfarm-shared/types';
import styles from './index.module.scss';

export default function PostTitle({ item }: { item: IFeedItem }) {
  const title =
    (item as IPublishedLinkFeedItem).payload?.title ||
    (item as IPublishedPostFeedItem).payload?.title ||
    (item as IPublishedPollFeedItem).payload?.question;

  if (!title) {
    return null;
  }

  return <div className={styles.wrapper}>{title}</div>;
}
