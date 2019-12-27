import React from 'react';
import styles from './index.module.scss';
import cx from 'classnames';

export default function Icon({
  icon,
  strokeWidth = 2,
  variant = 'stroke',
}: {
  icon: string;
  strokeWidth?: number;
  variant?: 'stroke' | 'shadow' | 'emblem';
}) {
  return (
    <span className={cx(styles.wrapper, styles[variant])}>
      <i className={icon} />
      <i className={icon} />
      <i className={icon} />
    </span>
  );
}
