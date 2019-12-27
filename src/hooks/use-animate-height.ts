import { useRef, useEffect } from 'react';
import useResizeObserver from './use-resize-observer';

export default function useAnimateHeight() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [elRef, commentsListDimensions] = useResizeObserver<
    HTMLAnchorElement
  >();

  useEffect(() => {
    if (elRef.current && wrapperRef.current) {
      wrapperRef.current.style.height =
        elRef.current.getBoundingClientRect().height + 'px';
    }
  }, [commentsListDimensions, elRef, wrapperRef]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'height 0.5s ease-out';
      wrapperRef.current.style.overflow = 'hidden';
    }
  }, [wrapperRef]);

  return [wrapperRef, (elRef as any) as React.RefObject<HTMLDivElement>];
}
