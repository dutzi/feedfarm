import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { IPublishedTextBombFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import useCurrentLangugage from '../../../../hooks/use-current-language';
import TextBombRenderer from '../../../../components/TextBombRenderer';
import useIntersectionObserver from '@react-hook/intersection-observer';

export default function PostedTextBombEntity({
  feedItem,
}: {
  feedItem: IPublishedTextBombFeedItem;
}) {
  return <div className={cx(styles.wrapper)}></div>;
}

// todo delete this file
