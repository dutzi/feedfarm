import * as functions from 'firebase-functions';
import { IGuestUser } from '../feedfarm-shared/types';
export declare function impl(data: {
    user: IGuestUser;
}, context: functions.https.CallableContext): Promise<{
    uid: string;
    token: string;
    error?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
    uid?: undefined;
    token?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
