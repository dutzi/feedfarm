import { IFeedItem } from '@feedfarm-shared/types';
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

  function isCanDelete() {
    return Boolean(isMeAuthor || isMeModerator || isMeOwner || isMeAdmin);
  }

  function isCanBan() {
    return Boolean((isMeAdmin || isMeOwner || isMeModerator) && !isMeAuthor);
  }

  function isCanViewInDb() {
    return Boolean(isMeAdmin);
  }

  function isShouldShowButton({ id }: { id: TAction }) {
    return {
      delete: isCanDelete,
      ban: isCanBan,
      'view-in-db': isCanViewInDb,
    }[id]();
  }

  const buttonsData = ([
    {
      id: 'delete',
      icon: 'trash',
      label: t('Delete'),
    },
    {
      id: 'ban',
      icon: 'ban',
      label: t('Ban User'),
    },
    {
      id: 'view-in-db',
      icon: 'database',
      label: t('View In DB'),
    },
  ] as { id: TAction; icon: string; label: string }[]).filter(
    isShouldShowButton,
  );

  return buttonsData;
}
