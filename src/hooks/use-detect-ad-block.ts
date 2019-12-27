import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { DetectAdBlock } from '@horat1us/detect-ad-block';
import useCurrentUser from './use-current-user';
import { updateCurrentUser } from '../state/actions';

export default function useDetectAdBlock() {
  const [hasAdBlock, setHasAdBlock] = useState<boolean>();
  const [currentUser] = useCurrentUser();
  const dispatch = useDispatch();

  function detect() {
    const detectAdBlock = DetectAdBlock();
    detectAdBlock
      .perform({ timeout: 1000 })
      .then(result => {
        setHasAdBlock(result);
      })
      .catch(error => {});
  }

  useEffect(() => {
    setTimeout(detect, 2500);
  }, []);

  useEffect(() => {
    // if (
    //   currentUser &&
    //   hasAdBlock !== undefined &&
    //   hasAdBlock !== currentUser.hasAdBlock
    // ) {
    //   dispatch(updateCurrentUser({ hasAdBlock }));
    // }
  }, [hasAdBlock, currentUser]);
}
