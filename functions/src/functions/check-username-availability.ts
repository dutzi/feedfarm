import * as functions from 'firebase-functions';
import isUsernameTaken from '../utils/is-username-taken';

export async function impl(
  data: { username: string },
  context: functions.https.CallableContext,
) {
  const available = !(await isUsernameTaken(data.username.trim().slice(0, 30)));

  return { available };
}

export default functions.https.onCall(impl);
