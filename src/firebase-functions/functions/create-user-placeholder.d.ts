import * as functions from 'firebase-functions';
import { IBasicUser } from '../feedfarm-shared/types';
export declare function impl(data: {
    email: string;
}, context: functions.https.CallableContext): Promise<IBasicUser | {
    error: boolean;
    errorCode: string;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
