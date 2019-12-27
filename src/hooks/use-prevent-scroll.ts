import { useEffect, useRef } from 'react';

export default function usePreventScroll(active?: boolean) {
  const lastOverflowValue = useRef('');

  useEffect(() => {
    if (active === undefined || active) {
      lastOverflowValue.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = lastOverflowValue.current;
    };
  }, [active]);
}
