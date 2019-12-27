import * as functions from 'firebase-functions';
import { IFeedItemLinkPayload, IFeedItemPostPayload, TFeedItemType, IFeedItemPollPayload, IFeedItemTextBombPayload } from '../feedfarm-shared/types';
export declare function impl(data: {
    type: TFeedItemType;
    payload: IFeedItemLinkPayload | IFeedItemPostPayload | IFeedItemPollPayload | IFeedItemTextBombPayload;
    feedId: string;
}, context: functions.https.CallableContext): Promise<{
    error: boolean;
    message: string;
} | {
    error?: undefined;
    message?: undefined;
}>;
declare const _default: functions.TriggerAnnotated & ((req: functions.Request, resp: functions.Response) => void) & functions.Runnable<any>;
export default _default;
