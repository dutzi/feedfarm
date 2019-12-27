import useCurrentUserId from './use-current-user-id';
import { isAdmin } from '../utils';

export default function useIsCurrentUserAdmin() {
  const currentUserId = useCurrentUserId();

  return isAdmin(currentUserId);
}
