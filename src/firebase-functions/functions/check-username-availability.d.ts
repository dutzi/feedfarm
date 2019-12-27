import * as functions from 'firebase-functions';
export declare function impl(data: {
    username: string;
}, context: functions.https.CallableContext): Promise<{
    available: boolean;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
