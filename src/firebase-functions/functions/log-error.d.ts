import * as functions from 'firebase-functions';
export declare function impl(data: {
    error: any;
    info: any;
}, context: functions.https.CallableContext): Promise<void>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
