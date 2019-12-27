import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import useCurrentUser from './use-current-user';

interface IDataBlock<T> {
  id: string;
  data: T;
}

export default function useCollection<T>(
  collectionPath?: string,
  options: {
    timeout?: number;
    fallbackKey?: string;
  } = { timeout: 250 },
): [IDataBlock<T>[] | undefined, boolean] {
  const [querySnapshot, setQuerySnapshot] = useState<IDataBlock<T>[]>();
  const [, isLoadingCurrentUser] = useCurrentUser();
  const [isLoadingCollection, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    if (collectionPath) {
      return firebase
        .firestore()
        .collection(collectionPath)
        .onSnapshot(snapshot => {
          setQuerySnapshot(
            snapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data() as T,
            })),
          );
          setIsLoading(false);
        });
    }
  }, [collectionPath]);

  useEffect(() => {
    if (
      isLoadingCollection &&
      !isLoadingCurrentUser &&
      !isUsingFallback &&
      options.fallbackKey
    ) {
      setTimeout(() => {
        if (!querySnapshot && options.fallbackKey) {
          const dataJson = window.localStorage.getItem(options.fallbackKey);
          if (dataJson) {
            setQuerySnapshot(JSON.parse(dataJson) as IDataBlock<T>[]);
          } else {
            setQuerySnapshot([]);
          }
          setIsUsingFallback(true);
        }
      }, options.timeout);
    }
  }, [
    isLoadingCurrentUser,
    isLoadingCollection,
    querySnapshot,
    isUsingFallback,
    options.fallbackKey,
  ]);

  return [querySnapshot, isLoadingCollection];
}
