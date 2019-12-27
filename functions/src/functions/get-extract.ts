import * as admin from 'firebase-admin';

import * as functions from 'firebase-functions';
const sha1 = require('sha1');
import axios from 'axios';
import { IExtract, IFunctionError } from '../feedfarm-shared/types';
// import setLastSeen from '../utils/set-last-seen';
const cheerio = require('cheerio');

const firestore = admin.firestore();

export async function impl(
  data: { url: string },
  context: functions.https.CallableContext,
) {
  // const res = await rp({
  //   method: 'GET',
  //   uri: data.url,
  // });

  if (!context.auth) {
    return {
      error: true,
      message: 'logged-out',
    } as IFunctionError;
  }

  // const uid = context.auth.uid;
  // const name = context.auth.token.name || null;
  // const picture = context.auth.token.picture || null;
  // const email = context.auth.token.email || null;
  // await setLastSeen(context.auth.uid);

  const url = data.url.match(/^http(s?):/) ? data.url : 'http://' + data.url;

  const urlHash = sha1(url);

  const extractFromDb = await firestore.doc(`extracts/${urlHash}`).get();

  if (extractFromDb.exists) {
    return extractFromDb.data() as IExtract;
  }

  const scrapeResponse = await axios
    .get(url)
    .then(response => {
      const $ = cheerio.load(response.data);
      const title: string | undefined = $('meta[property="og:title"]').attr(
        'content',
      );
      const description: string | undefined = $(
        'meta[property="og:description"]',
      ).attr('content');
      const thumbnailUrl: string | undefined = $(
        'meta[property="og:image"]',
      ).attr('content');
      return { title, description, thumbnailUrl };
    })
    .catch(err => {
      console.log(`[get-extract] could not extract metatags for ${url}`);
      return {
        error: true,
        message: 'could not extract metatags',
      } as IFunctionError;
    });

  if ('error' in scrapeResponse) {
    return scrapeResponse;
  }

  const extract: IExtract = {
    url,
  };

  if (scrapeResponse.title) {
    extract.title = scrapeResponse.title;
  }

  if (scrapeResponse.description) {
    extract.description = scrapeResponse.description;
  }

  if (scrapeResponse.thumbnailUrl) {
    extract.thumbnailUrl = scrapeResponse.thumbnailUrl;
  }

  await firestore
    .collection('extracts')
    .doc(urlHash)
    .create(extract);

  return extract;
}

export default functions.https.onCall(impl);
