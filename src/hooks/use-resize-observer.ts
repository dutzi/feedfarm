import { useState, useEffect, useRef } from 'react';
import ResizeObserver from '@juggle/resize-observer';

export default function useResizeObserver<T extends HTMLElement>(
  predefinedRefs?: React.RefObject<T>,
): [React.RefObject<T>, DOMRectReadOnly | undefined] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState<DOMRectReadOnly>();

  useEffect(() => {
    const refToUse = predefinedRefs || ref;

    if (!refToUse.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(entries => {
      setDimensions(entries[0].contentRect as any);
    });

    resizeObserver.observe(refToUse.current);

    return () => {
      if (refToUse.current) {
        resizeObserver.unobserve(refToUse.current);
      }
    };
  }, [(predefinedRefs || ref).current]);

  return [predefinedRefs || ref, dimensions];
}
