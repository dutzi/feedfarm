import { useSelector } from 'react-redux';
import { IState } from '../state/reducer';
import { IUser } from '@feedfarm-shared/types';

export default function useCurrentUser(): [IUser | undefined, boolean] {
  const currentUser = useSelector(
    (state: IState) => state.currentUser.currentUser,
  );
  const isLoading = useSelector((state: IState) => state.currentUser.isLoading);

  return [currentUser, isLoading];
}
