import { useEffect, useRef } from 'react';
import useMeasure from 'react-use-measure';
import polyfill from '@juggle/resize-observer';
import mergeRefs from 'typed-merge-refs';

export default function useMaintainRatio<T extends HTMLElement>(
  ratio: number,
  options: { active: boolean; change: 'height' | 'width' } = {
    active: true,
    change: 'height',
  },
) {
  const ref = useRef<HTMLDivElement>(null);
  const [measureRef, bounds] = useMeasure({ polyfill });

  useEffect(() => {
    if (ref.current && options.active) {
      if (options.change === 'height') {
        ref.current.style.height = bounds.width / ratio + 'px';
      } else {
        ref.current.style.width = bounds.height / ratio + 'px';
      }
    }

    return () => {
      if (ref.current) {
        ref.current.style.height = '';
        ref.current.style.width = '';
      }
    };
  }, [bounds]);

  return mergeRefs(measureRef, ref) as React.Ref<T>;
}
