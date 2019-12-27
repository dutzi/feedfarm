import React, { useState, useEffect } from 'react';

// export default function useProcessing(): [boolean, () => void, () => void] {
// TODO delete this hook
export default function useEffectOnce(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
  shouldRun?: boolean,
) {
  const [hasBeenCalled, setHasBeenCalled] = useState(false);

  useEffect(() => {
    if (!hasBeenCalled && shouldRun) {
      setHasBeenCalled(true);
      return effect();
    }
  }, deps);
}
