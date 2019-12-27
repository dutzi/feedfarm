import React, { useRef, useEffect, useImperativeHandle } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import usePreventScroll from '../../hooks/use-prevent-scroll';
import useFocusTrap from '../../hooks/use-focus-trap';
import gsap from 'gsap';
import { useAnimationRef } from '../../utils';
import mergeRefs from 'typed-merge-refs';

function useAnimation() {
  const content = useRef<HTMLDivElement>(null);

  function start() {
    if (content.current) {
      content.current.style.opacity = '0';
      gsap.to(content.current, { opacity: 1, duration: 0.5, scale: 1 });
    }
  }

  return {
    refs: {
      content,
    },
    start,
  };
}

function Modal(
  {
    show,
    onClose,
    children,
    backdropClickClose = true,
    title,
    showClose,
    backdropRef,
    controlledAnimation,
  }: {
    show: boolean;
    onClose: () => void;
    children: React.ReactElement;
    backdropClickClose?: boolean;
    title?: string;
    showClose?: boolean;
    backdropRef?: React.RefObject<HTMLDivElement>;
    controlledAnimation?: boolean;
  },
  ref: React.Ref<any>,
) {
  // const animation = useAnimation();
  const wrapper = useAnimationRef();
  const backdrop = useAnimationRef();
  usePreventScroll(show);
  const [focusTrapStart, focusTrapEnd] = useFocusTrap({
    autoFocus: !controlledAnimation,
  });

  useImperativeHandle(ref, () => ({
    animateLeave: (animationType: 'pop' | 'fly') => {
      if (animationType === 'pop') {
        return Promise.all([
          gsap.timeline().to(wrapper.current!, {
            scale: 0.9,
            opacity: 0,
            ease: 'back.in(2)',
            duration: 0.5,
          }),
          gsap
            .timeline()
            .to(backdrop.current, { delay: 0.5, opacity: 0, duration: 0.4 }),
        ]);
      } else if (animationType === 'fly') {
        return gsap.timeline().to(wrapper.current!, {
          y: '-100vh',
          duration: 0.5,
          ease: 'back.in(2)',
        });
      }
    },
  }));

  useEffect(() => {
    if (show && wrapper.current && backdrop.current) {
      gsap
        .timeline()
        .fromTo(backdrop.current, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(
          wrapper.current,
          { scale: 0.9, opacity: 0, filter: 'brightness(0)' },
          { scale: 1, opacity: 1, duration: 0.5 },
        )
        .to(wrapper.current, {
          x: -5,
          y: -5,
          duration: 0.5,
          filter: 'brightness(1)',
        });
    }
  }, [wrapper, backdrop, show]);

  if (!show) {
    return null;
  }

  function handleBackdropClick() {
    if (backdropClickClose) {
      onClose();
    }
  }

  return (
    <div
      className={cx(
        styles.wrapper,
        controlledAnimation && styles.controlledAnimation,
      )}
    >
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        ref={mergeRefs(backdrop, backdropRef)}
      ></div>
      <div ref={mergeRefs(ref, wrapper)} className={styles.content}>
        {focusTrapStart()}
        {(title || showClose) && (
          <div className={styles.header}>
            {title && <div className={styles.title}>{title}</div>}
            {showClose && (
              <button className={styles.closeButton} onClick={onClose}>
                ×
              </button>
            )}
          </div>
        )}
        {children}
        {focusTrapEnd()}
      </div>
    </div>
  );
}

export default React.forwardRef(Modal);
