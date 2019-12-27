import React from 'react';
import styles from './index.module.scss';

export default function Label({
  id,
  children,
  alignSelf,
}: {
  id?: string;
  children: string;
  alignSelf?: string;
}) {
  return (
    <label className={styles.label} htmlFor={id} style={{ alignSelf }}>
      {children}
    </label>
  );
}
