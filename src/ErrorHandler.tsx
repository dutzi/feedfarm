import React from 'react';
import styles from './error-handler.module.scss';

export default function ErrorHandler() {
  return (
    <div className={styles.wrapper}>
      <h1>An error has occured</h1>
      <p>We were notified and will handle this ASAP</p>
      <p>
        For now, hit <a href="/">Refresh</a>
      </p>
    </div>
  );
}
