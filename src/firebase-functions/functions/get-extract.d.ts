import * as functions from 'firebase-functions';
import { IExtract, IFunctionError } from '../feedfarm-shared/types';
export declare function impl(data: {
    url: string;
}, context: functions.https.CallableContext): Promise<IExtract | IFunctionError>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
