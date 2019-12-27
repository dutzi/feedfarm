import React from 'react';
import Spinner from '../Spinner';
import styles from './index.module.scss';
import useContentSizer from '../../hooks/use-content-sizer';

export default function PageFallbackSpinner() {
  const [wrapper] = useContentSizer();

  return (
    <div ref={wrapper} className={styles.wrapper}>
      <Spinner size="lg" />
    </div>
  );
}
