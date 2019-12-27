import * as functions from 'firebase-functions';
export declare function impl(data: {
    emojiId: string;
    postId: string;
    feedId: string;
}, context: functions.https.CallableContext): Promise<{
    error: boolean;
    message: string;
} | {
    error?: undefined;
    message?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
