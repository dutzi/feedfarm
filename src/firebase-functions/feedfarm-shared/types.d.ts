export declare type TUserStatus = 'm' | 'f' | 'mf' | 'mm' | 'ff';
export declare type TFirebaseDate = {
    _seconds: number;
} | Date;
export declare type TSupportedLanguages = 'en' | 'he' | 'es' | 'ru' | 'zh-cn' | 'zh-tw' | 'hi' | 'ar' | 'ms';
export interface INotification {
    id: string;
    type: 'requested-photos' | 'faved' | 'unfaved' | 'viewed' | 'match-pasted' | 'responded-photos-request';
    sourceUid: string;
    timestamp: TFirebaseDate;
    read: boolean;
    isResponded?: boolean;
    response?: 'approved' | 'declined';
    payload?: any;
}
export interface IUser {
    id: string;
    uuid?: string;
    email: string;
    username: string;
    lcasedUsername: string;
    bio: string;
    age?: number;
    location?: {
        lat: number;
        lng: number;
        country: string;
        city: string;
    };
    userPhoto: string;
    isTestUser: boolean;
    language: TSupportedLanguages;
    referrerId: string;
    referreeId?: string;
    lastSeen?: TFirebaseDate;
    isGuest: boolean;
    birthAvatar: string;
}
export interface IChatPreview {
    id: string;
    username: string;
    profilePhoto: string;
    isOnline?: boolean;
    hasUnreadMessages: boolean;
    lastMessageTimestamp: any;
    messageCount: number;
    isTestUser: boolean;
}
export interface IPublicUser {
    id: string;
    photos: string[];
    username: string;
    bio: string;
    location?: {
        city: string;
        country: string;
    };
}
export interface IGuestUser extends Pick<IUser, 'id' | 'username' | 'isGuest' | 'userPhoto' | 'birthAvatar'> {
    token: string;
}
export declare type TUserEditable = Pick<IUser, 'username' | 'userPhoto' | 'bio' | 'language' | 'isTestUser'>;
export interface IFilters {
    lookingFor: TUserStatus[];
    distance: number;
    isAnywhere: boolean;
}
export interface IPastebinAsset {
    thumbnailUrl: string;
    url: string;
}
export declare type TPastebinAssets = IPastebinAsset[];
export interface IAsset {
    type: 'video' | 'photo';
    thumbnailUrl: string;
    url: string;
}
export interface IExtract {
    thumbnailUrl?: string;
    title?: string;
    description?: string;
    url: string;
}
export interface IBasicAsset {
    thumbnailUrl: string;
    url: string;
}
export interface IMatch {
    matchingAssets: IBasicAsset[];
    matchingTags: string;
    score: number;
    user: IPublicUser;
    matchingReactions: {
        id: string;
        reaction: TReaction;
    }[];
}
export interface IGetExtractResponse {
    thumbnailUrl: string;
}
export interface IChatMessage {
    from: string;
    message?: string;
    imageUrl?: string;
    read: boolean;
    timestamp: any;
    isBeingSent?: boolean;
}
export interface ITag {
    name: string;
    length: number;
}
export interface IVideo {
    docId: string;
    id: string;
    source: 'youtube' | 'xvideos' | 'pornhub';
    tags: string[];
}
export declare type TReaction = 'like' | 'dislike' | 'vomit' | 'super-like' | 'meh';
export interface IReactionsMap {
    [videoId: string]: TReaction;
}
export interface IPostReaction {
    type: string;
    count: number;
}
export interface IFeedItemPostPayload {
    title: string;
    message: string;
    tags: string[];
}
export interface IFeedItemLinkPayload {
    url: string;
    tags: string[];
    title: string;
    extract: IExtract;
}
export interface IFeedItemPollPayload {
    question: string;
    answers: string[];
}
export declare type TTextBombStyle = 'pop' | 'skewyPop' | 'wave' | 'complex';
export interface IFeedItemTextBombPayload {
    text: string;
    style: TTextBombStyle;
}
export interface IBasicUser {
    uid: string;
    username: string;
    userPhoto: string;
}
export interface IFeedItemUserJoinedPayload {
    users: IBasicUser[];
}
export declare type TUserType = 'guest' | 'member' | 'me';
export declare type TFeedThemeType = 'default' | 'light' | 'bars' | 'messages' | 'notebook';
export declare type TFeedItemType = 'user-joined' | 'published-link' | 'published-post' | 'published-poll' | 'published-text-bomb';
export interface IFeedItemBase extends IBasicUser {
    type: TFeedItemType;
    payload?: IFeedItemLinkPayload | IFeedItemPostPayload | IFeedItemPollPayload | IFeedItemTextBombPayload;
}
export interface IFeedItem extends IFeedItemBase {
    timestamp: any;
    reactions: IPostReaction[];
}
export interface IPublishedLinkFeedItem extends IFeedItem {
    type: 'published-link';
    payload: IFeedItemLinkPayload;
}
export interface IPublishedPostFeedItem extends IFeedItem {
    type: 'published-post';
    payload: IFeedItemPostPayload;
}
export interface IPublishedPollFeedItem extends IFeedItem {
    type: 'published-poll';
    payload: IFeedItemPollPayload;
    answerCount: number;
}
export interface IPublishedTextBombFeedItem extends IFeedItem {
    type: 'published-text-bomb';
    payload: IFeedItemTextBombPayload;
}
export interface IPostComment extends IBasicUser {
    message: string;
    timestamp: any;
    numLikesRecieved: number;
}
export interface IFeed {
    id: string;
    name: string;
    lcasedName: string;
    canonicalName: string;
    design: {
        bgColor: string;
        postBgColor: string;
        textColor: string;
        postTextColor: string;
    };
    members: IBasicUser[];
    owners: IBasicUser[];
    moderators: IBasicUser[];
    bannedUsers: IBasicUser[];
    allowsReactions: boolean;
    allowsCommenting: boolean;
    allowsTags: boolean;
    allowedFeedItemTypes: TFeedItemType[] | 'all';
    theme: TFeedThemeType;
    whoCanRead: TUserType;
    whoCanWrite: TUserType;
    canReadUIDS: string[];
}
export declare type TUserActionType = 'commented' | 'published-to-feed' | 'reacted' | 'submitted-poll-answer';
export interface IUserAction {
    type?: TUserActionType;
    feedId: string;
    postId?: string;
    reactionId?: string;
    commentId?: string;
    answerId?: string;
}
export declare type TFeatureType = 'user-profile' | 'banned-users' | 'post-image' | 'post-video';
export declare type TFeatureResponseType = 'saw' | 'not-likely' | 'maybe' | 'very-likely';
export interface IFunctionError {
    error: true;
    message: string;
}
export declare type TUserRole = 'owners' | 'moderators' | 'members';
