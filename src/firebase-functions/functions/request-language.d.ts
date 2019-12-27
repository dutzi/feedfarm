import * as functions from 'firebase-functions';
export declare function impl(data: {
    languageCode: string;
}, context: functions.https.CallableContext): Promise<{}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
