import useCurrentUser from './use-current-user';
import { isPremium } from 'feedfarm-shared/utils';

export default function useIsCurrentUserPremium() {
  const [currentUser] = useCurrentUser();

  if (currentUser) {
    return isPremium(currentUser);
  } else {
    return false;
  }
}
