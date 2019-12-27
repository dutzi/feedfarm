import * as functions from 'firebase-functions';
export declare function impl(data: {
    token: string;
    email: string;
}, context: functions.https.CallableContext): Promise<{
    error: boolean;
    message: string;
    errorCode?: undefined;
} | {
    error?: undefined;
    message?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
    message?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
