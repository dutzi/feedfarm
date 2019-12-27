import * as functions from 'firebase-functions';
export declare function impl(data: {
    postId: string;
    emojiId: string;
    feedId: string;
}, context: functions.https.CallableContext): Promise<{
    usernames: string[];
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
