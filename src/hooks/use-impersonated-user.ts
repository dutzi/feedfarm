import { useSelector } from 'react-redux';
import { IState } from '../state/reducer';

export default function useImpersonatedUser() {
  return useSelector((state: IState) => state.currentUser.impersonatedUser);
}
