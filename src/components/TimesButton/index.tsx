import React from 'react';
import styles from './index.module.scss';

export default function TimesButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void,
}) {
  return (
    <button className={styles.wrapper} onClick={onClick}>
      <i className="fa fa-times" />
    </button>
  );
}
