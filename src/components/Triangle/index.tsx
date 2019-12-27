import React, { useEffect, useRef, forwardRef } from 'react';
import styles from './index.module.scss';
import cx from 'classnames';
import { ReactComponent as TriangleIcon } from '../Icons/triangle-small.svg';
import gsap from 'gsap';
import mergeRefs from 'typed-merge-refs';

function Triangle(
  {
    className,
    fill,
    shadow,
    stroke,
    animate,
    innerShadow = 'transparent',
  }: {
    className: string;
    fill?: string;
    shadow?: boolean;
    stroke?: string;
    animate?: boolean;
    innerShadow?: string;
  },
  forwardedRef: any,
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && fill) {
      ref.current.querySelector<SVGPathElement>(
        'path:nth-child(3)',
      )!.style.fill = fill;
    }
  }, [fill, ref]);

  useEffect(() => {
    if (ref.current && stroke) {
      ref.current.querySelector<SVGPathElement>(
        'path:nth-child(2)',
      )!.style.fill = stroke;
    }
  }, [stroke, ref]);

  useEffect(() => {
    if (ref.current) {
      ref.current.querySelector<SVGPathElement>(
        'path:nth-child(1)',
      )!.style.display = shadow ? 'initial' : 'none';
    }
  }, [shadow, ref]);

  useEffect(() => {
    if (ref.current) {
      ref.current.querySelector<SVGPathElement>(
        'path:nth-child(4)',
      )!.style.fill = innerShadow;
    }
  }, [innerShadow, ref]);

  useEffect(() => {
    if (animate) {
      gsap
        .timeline()
        .fromTo(
          ref.current!,
          { scaleX: 0 },
          { scaleX: 1, delay: 1.5, duration: 0.75, ease: 'back.out(3)' },
        );
    }
  }, [animate]);

  return (
    <div
      ref={mergeRefs(forwardedRef, ref)}
      className={cx(styles.wrapper, className)}
    >
      <TriangleIcon />
    </div>
  );
}

export default forwardRef(Triangle);
