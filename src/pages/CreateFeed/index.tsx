import React from 'react';
import CreateFeedComponent from '../../components/CreateFeed';
import styles from './index.module.scss';

export default function CreateFeed() {
  return (
    <div className={styles.wrapper}>
      <CreateFeedComponent />
    </div>
  );
}
