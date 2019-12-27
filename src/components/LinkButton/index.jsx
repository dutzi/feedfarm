import React from 'react';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

export default ({ label, href }) => {
  return (
    <Link to={href} className={styles.wrapper}>
      {label}
    </Link>
  );
};
