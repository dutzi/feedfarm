import * as functions from 'firebase-functions';
import { TUserEditable } from '../feedfarm-shared/types';
export declare function impl(data: {
    currentUser: Partial<TUserEditable>;
}, context: functions.https.CallableContext): Promise<{
    error?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
