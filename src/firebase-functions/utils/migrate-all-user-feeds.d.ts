import { IBasicUser, IGuestUser } from '../feedfarm-shared/types';
export default function migrateAllUserFeeds(oldUser: IGuestUser | IBasicUser, newUser: IBasicUser): Promise<void>;
