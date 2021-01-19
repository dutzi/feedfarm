import { IFeedItem } from '@feedfarm-shared/types';
import { IItemData } from '../ContextMenu';
import { useTranslation } from 'react-i18next';
import { useUserPermissions } from '../../hooks/use-user-permissions';

export function usePostContextMenuItems({ feedItem }: { feedItem: IFeedItem }) {
  const { t } = useTranslation();

  const {
    isMeAuthor,
    isMeOwner,
    isMeModerator,
    isMeAdmin,
  } = useUserPermissions({ feedItem });

  type TAction = 'delete' | 'ban' | 'view-in-db';
  const items: IItemData<TAction>[] = [];

  if (isMeAuthor || isMeModerator || isMeOwner || isMeAdmin) {
    items.push({
      id: 'delete',
      icon: 'trash',
      label: t('Delete'),
    });
  }
  if ((isMeAdmin || isMeOwner || isMeModerator) && !isMeAuthor) {
    items.push({
      id: 'ban',
      icon: 'ban',
      label: t('Ban User'),
    });
  }
  if (isMeAdmin) {
    items.push({
      id: 'view-in-db',
      icon: 'database',
      label: t('View In DB'),
    });
  }

  return items;
}
