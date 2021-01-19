import { IFeedItem } from '@feedfarm-shared/types';
import useCurrentUser from '../../../hooks/use-current-user';
import useFeed from '../../../hooks/use-feed';
import useIsCurrentUserAdmin from '../../../hooks/use-is-current-user-admin';

export function useUserPermissions({ feedItem }: { feedItem: IFeedItem }) {
  const [currentUser] = useCurrentUser();
  const feed = useFeed();
  const isMeAdmin = useIsCurrentUserAdmin();

  const isMeAuthor = feedItem.uid === currentUser?.id;
  const isMeOwner = feed?.owners.find((user) => user.uid === currentUser?.id);
  const isMeModerator = feed?.moderators.find(
    (user) => user.uid === currentUser?.id,
  );

  return {
    isMeAuthor,
    isMeOwner,
    isMeModerator,
    isMeAdmin,
  };
}
