import { useState } from 'react';

// export default function useProcessing(): [boolean, () => void, () => void] {
export default function useProcessing(state: boolean = false) {
  const [isProcessing, setIsProcessing] = useState(state);

  function startProcessing() {
    setIsProcessing(true);
  }

  function stopProcessing() {
    setIsProcessing(false);
  }

  // return [isProcessing, startProcessing, stopProcessing];
  return {
    state: isProcessing,
    start: startProcessing,
    stop: stopProcessing,
  };
}
