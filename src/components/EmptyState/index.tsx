import React from 'react';
import styles from './index.module.scss';

export default function EmptyState({
  emoji,
  emojiLabel,
  title,
  subtitle,
  body,
}: {
  emoji: string;
  emojiLabel: string;
  title: string;
  subtitle: string;
  body?: string | React.ReactNode;
}) {
  return (
    <div className={styles.emptyState}>
      <span role="img" aria-label={emojiLabel} className={styles.emoji}>
        {emoji}
      </span>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subtitle}</div>
      <div className="margin-h-md" />
      <div className={styles.body}>{body}</div>
    </div>
  );
}
