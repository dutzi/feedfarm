import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { isDoc } from '../utils';

interface IUseCallableOptions {
  data?: any;
  // when provided will call the function every interval milliseconds
  interval?: number;
  // when provided, will listen to snapshot updates and call the functions
  // whenever a new snapshot arrives
  snapshotPath?: string;
}

export default function useCallable<T>(
  functionName: string,
  options: IUseCallableOptions = {},
): [T | null, boolean] {
  const [response, setResponse] = useState<T>();
  const [isLoading, setIsLoading] = useState(true);

  function callFunction() {
    firebase
      .functions()
      .httpsCallable(functionName)(options.data)
      .then(response => {
        // debugger;
        setResponse(response.data as T);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  useEffect(() => {
    callFunction();

    const destroyers: (() => void)[] = [];

    if (options.interval) {
      const interval = setInterval(callFunction, options.interval);

      destroyers.push(() => {
        clearInterval(interval);
      });
    }

    if (options.snapshotPath) {
      let unsubscribe: () => void;

      if (isDoc(options.snapshotPath)) {
        unsubscribe = firebase
          .firestore()
          .doc(options.snapshotPath)
          .onSnapshot(callFunction);
      } else {
        unsubscribe = firebase
          .firestore()
          .collection(options.snapshotPath)
          .onSnapshot(callFunction);
      }

      destroyers.push(unsubscribe);
    }

    return () => {
      destroyers.forEach(destroy => {
        destroy();
      });
    };
  }, [options.snapshotPath, options.interval]);

  return [response || null, isLoading];
}
