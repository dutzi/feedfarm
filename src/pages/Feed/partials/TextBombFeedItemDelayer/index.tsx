import React, { useEffect, useState } from 'react';
import { IPublishedTextBombFeedItem } from '@feedfarm-shared/types';
import useIntersectionObserver from '@react-hook/intersection-observer';
import TextBombRenderer from '../../../../components/TextBombRenderer';

export default function TextBombFeedItemDelayer({
  feedItem,
  children,
}: {
  feedItem: IPublishedTextBombFeedItem;
  children: JSX.Element;
}) {
  const [entry, ref] = useIntersectionObserver();
  const [showFeedItem, setShowFeedItem] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (entry.isIntersecting) {
      setIsIntersecting(true);
    }
  }, [entry]);

  useEffect(() => {
    if (entry.isIntersecting) {
    }
  }, [entry]);

  function handleAnimationDone() {
    setTimeout(() => {
      setShowFeedItem(true);
    }, 2000);
  }

  if (showFeedItem) {
    return children;
  }

  return (
    <div ref={ref as any}>
      {isIntersecting && (
        <TextBombRenderer
          text={feedItem.payload.text}
          animationStyle={feedItem.payload.style}
          onDone={handleAnimationDone}
        />
      )}
    </div>
  );
}
