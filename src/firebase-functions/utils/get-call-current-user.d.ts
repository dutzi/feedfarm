import * as functions from 'firebase-functions';
import { IUser } from '../feedfarm-shared/types';
export default function getCallCurrentUser(context: functions.https.CallableContext): Promise<IUser>;
