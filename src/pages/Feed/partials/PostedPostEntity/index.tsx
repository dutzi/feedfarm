import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { IPublishedPostFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import useCurrentLangugage from '../../../../hooks/use-current-language';

export default function PostedPostEntity({
  feedItem,
}: {
  feedItem: IPublishedPostFeedItem;
}) {
  return <div className={cx(styles.wrapper)}>{feedItem.payload.message}</div>;
}
