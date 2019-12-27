import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { IUser } from '@feedfarm-shared/types';
import useCurrentUserId from './use-current-user-id';
import useCurrentUser from './use-current-user';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentUser } from '../state/actions';
import { IState } from '../state/reducer';

export default function useFavUser(
  targetUserId: string,
): [() => void, () => void, boolean, boolean] {
  const [isFaved, setIsFaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUser] = useCurrentUser();
  const currentUserId = useCurrentUserId();
  const dispatch = useDispatch();

  useEffect(() => {
    // if (currentUser) {
    //   setIsFaved((currentUser.favorites || []).indexOf(targetUserId) !== -1);
    // }
  }, [currentUser, targetUserId]);

  async function favUser() {
    // setIsProcessing(true);
    // const docRef = firebase.firestore().doc(`/users/${currentUserId}`);
    // const currentUserData = (await docRef.get()).data() as IUser;
    // currentUserData.favorites = currentUserData.favorites || [];
    // if (currentUserData.favorites.indexOf(targetUserId) === -1) {
    //   currentUserData.favorites.push(targetUserId);
    // }
    // await dispatch(updateCurrentUser({ favorites: currentUserData.favorites }));
    // setIsProcessing(false);
  }

  async function unFavUser() {
    // setIsProcessing(true);
    // const docRef = firebase.firestore().doc(`/users/${currentUserId}`);
    // const currentUserData = (await docRef.get()).data() as IUser;
    // currentUserData.favorites = currentUserData.favorites || [];
    // if (currentUserData.favorites.indexOf(targetUserId) !== -1) {
    //   currentUserData.favorites.splice(
    //     currentUserData.favorites.indexOf(targetUserId),
    //     1,
    //   );
    // }
    // await dispatch(updateCurrentUser({ favorites: currentUserData.favorites }));
    // setIsProcessing(false);
  }

  return [favUser, unFavUser, isFaved, isProcessing];
}
