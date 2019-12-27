import * as functions from 'firebase-functions';
import { TSupportedLanguages } from '../feedfarm-shared/types';
export declare function impl(data: {
    email: string;
    name: string;
    language: TSupportedLanguages;
}, context: functions.https.CallableContext): Promise<{
    error: boolean;
    errorCode: string;
} | {
    error?: undefined;
    errorCode?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
