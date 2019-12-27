import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import gsap from 'gsap';
import styles from './animations.module.scss';

const HEIGHT = 25;

function StripesFC({}, ref: any) {
  const stripeRefs: React.RefObject<HTMLDivElement>[] = [];
  const state = useRef<'idle' | 'running'>('idle');

  for (var i = 0; i < window.innerHeight / HEIGHT; i++) {
    const stripeRef = React.createRef<HTMLDivElement>();
    stripeRefs.push(stripeRef);
  }

  useImperativeHandle(ref, () => ({
    run: () => {
      return;
      if (state.current === 'running') {
        return;
      }

      state.current = 'running';
      stripeRefs.forEach((stripe, index) => {
        gsap.timeline().to(stripe.current!, {
          // x: index % 2 === 0 ? '100vw' : '-100vw',
          height: 0,
          duration: 1,
          onStart: () => {
            // document.body.style.background = 'var(--background-gradient-1)';
          },
        });
      });
    },
  }));

  function getStripeStyle(index: number) {
    return {
      top: index * HEIGHT + 'px',
      height: HEIGHT + 'px',
    };
  }

  return (
    <div className={styles.wrapper}>
      {stripeRefs.map((ref, index) => (
        <div
          key={index}
          className={styles.stripe}
          ref={ref}
          style={getStripeStyle(index)}
        />
      ))}
    </div>
  );
}

export const Stripes = forwardRef(StripesFC);
