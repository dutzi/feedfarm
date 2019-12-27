import React, { useState, useEffect, useRef, useCallback } from 'react';
import cx from 'classnames';
import { IPublishedLinkFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import useIsMobile from '../../../../hooks/use-is-mobile';
import useResizeObserver from '../../../../hooks/use-resize-observer';
import useIntersectionObserver from '@react-hook/intersection-observer';

function useStickyEvent(): [boolean, JSX.Element] {
  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!ref.current || isMobile) {
      return;
    }

    const cachedRef = ref.current,
      observer = new IntersectionObserver(
        ([e]) =>
          setIsSticky(
            e.intersectionRatio < 1 &&
              cachedRef.getBoundingClientRect().top <= 0,
          ),
        { threshold: [1] },
      );

    observer.observe(cachedRef);

    return () => {
      observer.unobserve(cachedRef);
    };
  }, [isMobile]);

  return [
    isSticky,
    <div
      ref={ref}
      style={{
        marginTop: 'calc(-76px - 20px)',
        position: 'absolute',
        width: '20px',
        height: '20px',
        top: '0px',
      }}
    ></div>,
  ];
}

export default function PostedLinkEntity({
  isLargerThanScreen,
  feedItem,
}: {
  isLargerThanScreen: boolean;
  feedItem: IPublishedLinkFeedItem;
}) {
  const [isSticky, stickyElement] = useStickyEvent();
  const [iframeURL, setIframeURL] = useState<string>();
  const [iframeEntry, iframe] = useIntersectionObserver();
  const [entityRef, entityDimensions] = useResizeObserver<HTMLAnchorElement>();
  const [isEntityHigh, setIsEntityHigh] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [assetSize, setAssetSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!iframeEntry.isIntersecting && !keepPlaying) {
      setIframeURL(undefined);
    }
  }, [iframeEntry]);

  useEffect(() => {
    if (entityDimensions) {
      setIsEntityHigh(entityDimensions.width < entityDimensions.height);
    }
  }, [entityDimensions]);

  const getHostname = useCallback(() => {
    const url = new window.URL(feedItem.payload!.url);
    return url.hostname;
  }, [feedItem.payload]);

  useEffect(() => {
    const hostname = getHostname();
    if (hostname === 'www.youtube.com') {
      setAssetSize({
        width: 504,
        height: 286,
      });
    } else if (hostname === 'open.spotify.com') {
      setAssetSize({
        width: 504,
        height: 504,
      });
    }
  }, [getHostname]);

  function handleEntityClick(e: React.MouseEvent) {
    const url = new window.URL(feedItem.payload!.url);
    const hostname = getHostname();

    if (hostname === 'www.youtube.com') {
      const search = feedItem.payload?.url.split('?')[1];
      const urlParams = new window.URLSearchParams(search);
      const videoId = urlParams.get('v');
      if (videoId) {
        setIframeURL(`https://www.youtube.com/embed/${videoId}?autoplay=1`);
        e.preventDefault();
      }
    } else if (hostname === 'open.spotify.com') {
      const splitUrl = url.href.split('/');
      splitUrl.splice(3, 0, 'embed');
      setIframeURL(splitUrl.join('/'));
      setKeepPlaying(true);
      e.preventDefault();
    }
  }

  const shouldStick = isLargerThanScreen && !isEntityHigh;

  return (
    <div
      className={cx(
        styles.wrapper,
        shouldStick && styles.sticky,
        shouldStick && isSticky && styles.isSticky,
        !feedItem.payload.extract.thumbnailUrl && styles.noExtract,
      )}
    >
      {stickyElement}
      <a
        ref={entityRef}
        href={feedItem.payload?.url}
        target="_blank"
        onClick={handleEntityClick}
      >
        {feedItem.payload.extract.thumbnailUrl ? (
          iframeURL ? (
            <iframe
              ref={iframe as any}
              src={iframeURL}
              frameBorder="0"
              className={styles.entity}
              width={assetSize.width}
              height={assetSize.height}
              scrolling="no"
              allowFullScreen
              title="Preview"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : (
            <img
              className={styles.entity}
              src={feedItem.payload?.extract?.thumbnailUrl}
              style={{
                height: assetSize.height + 'px',
              }}
              alt="Preview"
            />
          )
        ) : (
          feedItem.payload.url
        )}
      </a>
    </div>
  );
}
