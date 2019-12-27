import { ADMIN_UID } from './consts';

export default function getUid(data: any, authUserUid: string) {
  if (data && data.impersonatedUid) {
    if (authUserUid === ADMIN_UID) {
      return { uid: data.impersonatedUid, isImpersonate: true };
    }
  }

  return { uid: authUserUid, isImpersonate: false };
}
