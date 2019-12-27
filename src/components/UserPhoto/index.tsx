import React, { forwardRef, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { Emoji } from 'emoji-mart';
import { getColor, getEmoji } from '../../utils';
import mergeRefs from 'typed-merge-refs';

function UserPhoto(
  {
    photo,
    className,
    size,
  }: { photo?: string; className?: string; size: 'sm' | 'md' | 'lg' | 'x-lg' },
  ref: any,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photo && photo.startsWith('!') && wrapperRef.current) {
      const emojiSpan = wrapperRef.current.querySelector('span');
      if (emojiSpan) {
        // emojiSpan.style.outlineColor = getColor(photo);
      }
    }
  }, [photo, ref]);

  if (!photo) {
    return <div></div>;
  } else if (photo.startsWith('!')) {
    const emojiSize = { sm: 25, md: 30, lg: 35, 'x-lg': 55 }[size];
    return (
      <div
        ref={mergeRefs(ref, wrapperRef)}
        className={cx(styles.wrapper, styles[`size-${size}`], className)}
        style={{ background: getColor(photo) }}
      >
        <Emoji emoji={getEmoji(photo)} size={emojiSize} />
      </div>
    );
  } else {
    return <img ref={ref} className={className} src={photo} />;
  }
}

export default forwardRef(UserPhoto);
