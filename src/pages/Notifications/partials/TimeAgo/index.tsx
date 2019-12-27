import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import useCurrentLanguage from '../../../../hooks/use-current-language';

dayjs.extend(relativeTime);

export default function TimeAgo({
  timestamp,
  className,
}: {
  timestamp: any;
  className?: string;
}) {
  const time = new Date((timestamp._seconds || timestamp.seconds) * 1000);
  const { language } = useCurrentLanguage();
  return (
    <div
      className={cx(styles.wrapper, className)}
      title={dayjs(time)
        .locale(language)
        .format('MM-DD-YYYY HH:mm:ss A')}
    >
      {dayjs(time)
        .locale(language)
        .fromNow()}
    </div>
  );
}
