import * as functions from 'firebase-functions';
export declare function impl(data: {
    feedId: string;
    feedItemId: string;
    answerIndex: number;
}, context: functions.https.CallableContext): Promise<{
    error: boolean;
    message: string;
    distribution?: undefined;
    errorCode?: undefined;
} | {
    distribution: {
        [x: string]: any;
    };
    error?: undefined;
    message?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
    message?: undefined;
    distribution?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
