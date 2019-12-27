import React, { useState, useEffect, useRef } from 'react';
import Triangle from '../../../../components/Triangle';
import cx from 'classnames';
import { IPublishedLinkFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import useIsMobile from '../../../../hooks/use-is-mobile';
import useResizeObserver from '../../../../hooks/use-resize-observer';
import useIntersectionObserver from '@react-hook/intersection-observer';

export default function PostTriangle() {
  const isMobile = useIsMobile();
  if (isMobile) {
    return null;
  }

  return (
    <Triangle
      className={styles.wrapper}
      stroke="var(--post-border-color)"
      fill="var(--post-bg)"
    />
  );
}
