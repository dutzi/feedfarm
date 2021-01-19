import React, { useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Spinner from '../../../../components/Spinner';
import gsap from 'gsap';

export type TAction = string;

export interface IItemData<T extends TAction> {
  id: T;
  icon: string;
  label: string;
}

export default function ContextMenu<T extends TAction>({
  items,
  showSpinner,
  onClick,
}: {
  items: IItemData<T>[];
  showSpinner?: boolean;
  onClick: (action: T) => void;
}) {
  const menuButtons = useRef<HTMLDivElement>(null);
  const timeout = useRef<NodeJS.Timeout>();
  const isShowingMenu = useRef(false);
  const timelines = useRef<gsap.core.Timeline[]>([]);

  function pauseAllTimelines() {
    timelines.current.forEach((timeline) => timeline.pause());
  }

  function handleMouseOver(e: React.MouseEvent | React.FocusEvent) {
    if (showSpinner) {
      return;
    }

    const closestButton = (e.target as HTMLElement).closest('[data-button]');
    if (closestButton) {
      gsap.to(closestButton.querySelector('div')!, {
        x: 4,
        color: '#ffffff',
        duration: 0.4,
      });
    }

    clearTimeout(timeout.current!);
    if (isShowingMenu.current) {
      return;
    }

    menuButtons.current!.style.pointerEvents = 'all';

    isShowingMenu.current = true;

    pauseAllTimelines();

    timelines.current = [
      gsap.timeline().fromTo(
        menuButtons.current?.querySelectorAll('button')!,
        { y: -20 },
        {
          y: 0,
          opacity: 1,
          duration: 0.24,
          stagger: 0.05,
          ease: 'back.out(1)',
        },
      ),
      gsap.timeline().fromTo(
        menuButtons.current?.querySelectorAll('button > div')!,
        { opacity: 0, x: -20 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.4,
        },
      ),
    ];
  }

  function handleMouseOut(e: React.MouseEvent | React.FocusEvent) {
    const closestButton = (e.target as HTMLElement).closest('[data-button]');
    if (closestButton) {
      gsap.to(closestButton.querySelector('div')!, {
        x: 0,
        color: getComputedStyle(document.documentElement).getPropertyValue(
          '--context-menu-label-color',
        ),
        duration: 0.4,
      });
    }

    timeout.current = setTimeout(hideButtons, 250);
  }

  const hideButtons = useCallback(() => {
    const buttons = menuButtons.current?.querySelectorAll('button');

    if (buttons) {
      pauseAllTimelines();
      timelines.current = [
        gsap.timeline().to([...buttons].reverse(), {
          opacity: 0,
          duration: 0.24,
          stagger: 0.05,
        }),
      ];

      timelines.current[0].then(() => {
        if (!isShowingMenu.current && menuButtons.current) {
          menuButtons.current.style.pointerEvents = 'none';
        }
      });
    }

    isShowingMenu.current = false;
  }, []);

  useEffect(() => {
    if (showSpinner) {
      hideButtons();
    }
  }, [hideButtons, showSpinner]);

  if (!items.length) {
    return null;
  }

  return (
    <div className={cx(styles.wrapper, showSpinner && styles.showSpinner)}>
      <button
        className={cx(styles.button, styles.menuButton)}
        onMouseOver={handleMouseOver}
        onFocus={handleMouseOver}
        onMouseOut={handleMouseOut}
        onBlur={handleMouseOut}
      >
        <i className="fa fa-ellipsis-v" />
        {showSpinner && (
          <div className={styles.spinner}>
            <Spinner size="sm" color="var(--context-menu-color)" />
          </div>
        )}
      </button>
      <div
        ref={menuButtons}
        className={styles.menuItemButtons}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onFocus={handleMouseOver}
            onBlur={handleMouseOut}
            className={styles.button}
            onClick={onClick.bind(null, item.id)}
            data-button
          >
            <i className={`fa fa-${item.icon}`} />
            <i className={`fa fa-${item.icon}`} />
            <div className={styles.label}>{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
