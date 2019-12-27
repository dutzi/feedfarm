import { IState, useTypedDispatch } from './reducer';
import firebase from 'firebase/app';
import { TUserEditable } from '@feedfarm-shared/types';
import { updateCurrentUser as firebaseUpdateCurrentUser } from '../firebase-functions';

export function updateCurrentUser(currentUser: Partial<TUserEditable>) {
  return (
    dispatch: ReturnType<typeof useTypedDispatch>,
    getState: () => IState,
  ) => {
    const oldCurrentUser = getState().currentUser.currentUser;
    if (!oldCurrentUser) {
      throw new Error('Cannot update currentUser before setting it');
    }

    // // todo is this ok?
    // if (getState().currentUser.currentUser?.isGuest) {
    //   return;
    // }

    const typedKeys = Object.keys(currentUser) as (keyof typeof currentUser)[];

    if (typedKeys.find(key => currentUser[key] !== oldCurrentUser[key])) {
      dispatch({ type: 'update-current-user', payload: { currentUser } });

      return firebaseUpdateCurrentUser({
        currentUser,
      });
    }
  };
}
