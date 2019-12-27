import * as functions from 'firebase-functions';

export async function impl(
  data: { error: any; info: any },
  context: functions.https.CallableContext,
) {
  throw new Error(JSON.stringify({ error: data.error, info: data.info }));
}

export default functions.https.onCall(impl);
