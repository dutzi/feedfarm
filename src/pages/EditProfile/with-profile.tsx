import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { IUser } from '@feedfarm-shared/types';

export default function withProfile(Component: React.ElementType) {
  return (props: any) => {
    const [profile, setProfile] = useState<IUser>();

    useEffect(() => {
      if (props.uid) {
        firebase
          .firestore()
          .doc(`/users/${props.uid}`)
          .get()
          .then(profileDocRef => {
            setProfile(profileDocRef.data() as IUser);
          });
      }
    }, [props.uid]);

    if (!profile) return null;

    return <Component {...props} profile={profile} />;
  };
}
