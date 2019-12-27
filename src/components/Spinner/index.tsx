import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';

export default function Spinner({
  size,
  speed = 'fast',
  center,
  className,
  color, // todo
}: {
  size: 'x-sm' | 'sm' | 'md' | 'lg';
  speed?: 'fast' | 'slow';
  center?: boolean;
  className?: string;
  color?: string;
}) {
  const spinner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (color && spinner.current) {
      spinner.current.style.borderTopColor = color;
      spinner.current.style.borderLeftColor = color;
    }
  }, [color]);

  return (
    <span
      className={cx(
        styles.wrapper,
        center && styles.center,
        styles[`size-${size}`],
        styles[`speed-${speed}`],
        className,
      )}
    >
      <span ref={spinner} className={styles.spinner} />
    </span>
  );
}
