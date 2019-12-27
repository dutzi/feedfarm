import { IUser } from './types';
export declare function isLegitUsername(usernmae: string): boolean;
export declare function isPremium(user: IUser): boolean;
export declare function parseTags(tags: string): string[];
export declare function canonizeFeedName(name: string): string;
export declare const avatarColors: string[];
export declare const avatarEmojis: string[];
export declare function generateUserPhoto(): any;
export declare const SYSTEM_ADMIN_UID = "peNEXtLHb0VkYNWe1lGkwQ1Jo0C3";
