import useCurrentUser from './use-current-user';

export default function useCurrentUserId() {
  const [currentUser] = useCurrentUser();

  if (currentUser) {
    return currentUser.id;
  } else {
    return '';
  }
}
