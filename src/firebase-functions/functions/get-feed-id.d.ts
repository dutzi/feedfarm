import * as functions from 'firebase-functions';
export declare function impl(data: {
    feedName: string;
}, context: functions.https.CallableContext): Promise<{
    feedId: any;
    error?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
    feedId?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
