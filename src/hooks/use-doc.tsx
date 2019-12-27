import { useState, useEffect } from 'react';
import firebase from 'firebase/app';

export default function useDoc<T>(
  documentPath: string,
): [firebase.firestore.DocumentSnapshot | undefined, T | undefined] {
  const [documentSnapshot, setDocumentSnapshot] = useState<
    firebase.firestore.DocumentSnapshot
  >();

  useEffect(() => {
    firebase
      .firestore()
      .doc(documentPath)
      .get()
      .then(res => {
        setDocumentSnapshot(res);
      });
  }, [documentPath]);

  return [
    documentSnapshot,
    documentSnapshot && (documentSnapshot!.data() as T),
  ];
}
