import React from 'react';
import { ADMIN_USERNAME } from '../../../utils';
import useCurrentUser from '../../../hooks/use-current-user';
import { useTypedDispatch } from '../../../state/reducer';
import { useTranslation } from 'react-i18next';

export default function useUserLink(username: string, uid: string) {
  const [currentUser] = useCurrentUser();
  const dispatch = useTypedDispatch();
  const { t } = useTranslation();

  function handleUserClick(e: React.MouseEvent) {
    e.preventDefault();

    dispatch({
      type: 'show-priority-feedback-modal',
      payload: { featureType: 'user-profile' },
    });
    // if (currentUser) {
    //   dispatch({ type: 'open-profile', payload: { uid } });
    // } else {
    //   dispatch({ type: 'open-signup-modal' });
    // }
  }

  if (username === ADMIN_USERNAME) {
    return <a>{username}</a>;
  } else {
    return (
      <a href={`/u/${username}`} onClick={handleUserClick}>
        {username}
      </a>
    );
  }
}
