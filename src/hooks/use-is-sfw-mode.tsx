// import useCurrentUser from './use-current-user';
import useCurrentUser from './use-current-user';

export default function useIsSFWMode() {
  const [currentUser] = useCurrentUser();

  return false;
}
