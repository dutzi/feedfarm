import { useEffect } from 'react';

export default function useReferrerDetection() {
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);

    let referrer: string | undefined = undefined;

    if (urlSearchParams.get('utm_campaign')) {
      referrer = [
        urlSearchParams.get('utm_campaign'),
        urlSearchParams.get('utm_source'),
        urlSearchParams.get('utm_medium'),
        urlSearchParams.get('utm_content'),
      ].join('&');

      window.localStorage.setItem('referrer', referrer);
    }
  }, []);
}
