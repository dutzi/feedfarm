import * as functions from 'firebase-functions';
import { IFeed } from '../feedfarm-shared/types';
export declare function impl(data: void, context: functions.https.CallableContext): Promise<{
    numFeeds: number;
    feedsByRole: {
        owners: IFeed[];
        moderators: IFeed[];
        members: IFeed[];
    };
    error?: undefined;
    errorCode?: undefined;
} | {
    error: boolean;
    errorCode: string;
    numFeeds?: undefined;
    feedsByRole?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
