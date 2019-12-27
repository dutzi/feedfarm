import { IUser } from '../feedfarm-shared/types';
import modifyDoc from './modify-doc';

export default async function modifyUser(
  uid: string,
  callback: (draftState: IUser) => void,
) {
  await modifyDoc(`/users/${uid}`, callback);
}
