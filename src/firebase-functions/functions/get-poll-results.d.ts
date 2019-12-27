import * as functions from 'firebase-functions';
export declare function impl(data: {
    feedId: string;
    feedItemId: string;
}, context: functions.https.CallableContext): Promise<{
    distribution: {};
    error?: undefined;
    errorCode?: undefined;
} | {
    distribution?: undefined;
    error?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
    distribution?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
