import { useEffect } from 'react';

interface IKeyMap {
  [key: string]: Function;
}

export default function useKeyboardShortcut(keyMap: IKeyMap) {
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (!e.ctrlKey) {
        return;
      }

      const callback = keyMap[e.key];
      if (callback) {
        callback();
      }
    }
    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  });
}
