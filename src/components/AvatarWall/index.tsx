import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.scss';
import cx from 'classnames';
import { generateUserPhoto } from 'feedfarm-shared/utils';
import useIsMobile from '../../hooks/use-is-mobile';
import UserPhoto from '../UserPhoto';
import { Trans } from 'react-i18next';

export default function AvatarWall() {
  const [showWall, setShowWall] = useState(false);
  const [matrix, setMatrix] = useState<string[][]>([]);
  const timeline = useRef<gsap.core.Timeline>();
  const wrapper = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const avatarSize = Number(styles.avatarSize) / (isMobile ? 1 : 1);

  useEffect(() => {
    const numAvatarsPerRow = Math.ceil(window.innerWidth / avatarSize / 2);
    const numAvatarsPerColumn = Math.ceil(window.innerHeight / avatarSize);

    function generateMatrix() {
      let matrix = new Array(numAvatarsPerColumn)
        .fill(0)
        .map(() => new Array(numAvatarsPerRow).fill(0));

      matrix = matrix.map(row => row.map(item => generateUserPhoto()));

      setMatrix(matrix);
    }

    if (!showWall) {
      generateMatrix();

      setTimeout(() => {
        setShowWall(true);
      }, 1500);
      return;
    }

    function reverseLastAnimation() {
      if (timeline.current) {
        return timeline.current.reverse();
      }
    }

    function animateAvatars() {
      if (wrapper.current) {
        timeline.current = gsap.timeline().fromTo(
          [...wrapper.current.querySelectorAll('[data-avatar]')].filter(
            item => Math.random() < 0.2,
          ),
          {
            // filter: 'brightness(1)',
          },
          {
            x: -5,
            y: -5,
            ease: 'out',
            duration: 0.2,
            stagger: 0.0,
            // filter: 'brightness(1.5)',
          },
        );
      }
    }

    const interval = setInterval(() => {
      const timeline = reverseLastAnimation();

      if (timeline) {
        timeline.then(() => {
          // generateMatrix();
          animateAvatars();
        });
      } else {
        animateAvatars();
      }
    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, [showWall]);

  return (
    <div
      ref={wrapper}
      className={cx(styles.wrapper, !showWall && styles.hide)}
      style={{
        gridTemplateColumns: `repeat(${matrix[0]?.length}, auto)`,
      }}
    >
      {matrix.map((row, x) => {
        return row.map((item, y) => {
          return (
            <div key={`${x}_${y}`} data-avatar className={styles.avatarWrapper}>
              <UserPhoto className={styles.avatar} photo={item} size="lg" />
            </div>
          );
        });
      })}

      <div className={styles.message}>
        <Trans>Logging In</Trans>
      </div>
    </div>
  );
}
