import React, { useRef, useEffect, useState } from 'react';

export default function useFocusTrap({
  autoFocus = true,
  betterPreventScroll = false,
}: {
  autoFocus?: boolean;
  betterPreventScroll?: boolean;
} = {}) {
  const startFocusRef = useRef<HTMLDivElement>(null);
  const endFocusRef = useRef<HTMLDivElement>(null);
  const [hasFocusOnMount, setHasFocusOnMount] = useState(false);

  function handleStartKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode === 9 && e.shiftKey && endFocusRef.current) {
      endFocusRef.current.focus({ preventScroll: true });
    }
  }

  function handleEndKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode === 9 && !e.shiftKey && startFocusRef.current) {
      startFocusRef.current.focus({ preventScroll: true });
    }
  }

  useEffect(() => {
    if (startFocusRef.current && !hasFocusOnMount && autoFocus) {
      startFocusRef.current.focus();
      setHasFocusOnMount(true);
    }
  }, [startFocusRef.current, autoFocus]);

  useEffect(() => {
    if (endFocusRef.current && betterPreventScroll) {
      Object.assign(endFocusRef.current.style, {
        position: 'absolute',
        top: '0px',
      });
    }
  }, [endFocusRef, betterPreventScroll]);

  function focusTrapStart() {
    return (
      <div
        ref={startFocusRef}
        tabIndex={0}
        onKeyDown={handleStartKeyDown}
      ></div>
    );
  }
  function focusTrapEnd() {
    return (
      <div ref={endFocusRef} tabIndex={0} onKeyDown={handleEndKeyDown}></div>
    );
  }

  return [focusTrapStart, focusTrapEnd];
}
