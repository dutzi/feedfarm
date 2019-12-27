interface IUserRolesMap {
    postAuthor?: boolean;
    superAdmin?: boolean;
    feedOwner?: boolean;
    feedModerator?: boolean;
}
export default function getUserRoles({ uid, postId, feedId, }: {
    uid: string;
    postId?: string;
    feedId?: string;
}): Promise<IUserRolesMap>;
export {};
