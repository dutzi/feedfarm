import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { IUser, IGuestUser } from '@feedfarm-shared/types';
import { generateUserPhoto } from 'feedfarm-shared/utils';
import { getUsername } from '../utils';
import { createGuestUser } from '../firebase-functions';

export default function useCurrentUserFromFirebase(): [
  IUser | null | undefined,
] {
  const [user, setUser] = useState<IUser | null>();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const unsubscribe = firebase
          .firestore()
          .doc(`/users/${user.uid}`)
          .onSnapshot(userDoc => {
            if (userDoc.exists) {
              const userData = userDoc.data() as IUser;
              unsubscribe();
              setUser(userData);
            } else if (user.isAnonymous) {
              const userPhoto = generateUserPhoto();
              const user: IGuestUser = {
                id: 'temp-id',
                token: 'temp-token',
                username: getUsername(userPhoto),
                userPhoto,
                isGuest: true,
                birthAvatar: userPhoto,
              };

              createGuestUser({ user }).then(res => {
                setUser({
                  // todo fix this!!!
                  ...((user as unknown) as IUser),
                  isGuest: true,
                  id: res.uid,
                  token: res.token,
                } as IUser);
              });
            }
          });

        return unsubscribe;
      } else {
        firebase.auth().signInAnonymously();
      }
    });
  }, []);

  return [user];
}
