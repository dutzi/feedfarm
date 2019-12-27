import React from 'react';
import {
  IFeedItem,
  IPublishedLinkFeedItem,
  IPublishedPostFeedItem,
  IPublishedPollFeedItem,
  IPublishedTextBombFeedItem,
} from '@feedfarm-shared/types';
import PostedLinkEntity from '../PostedLinkEntity';
import PostedPostEntity from '../PostedPostEntity';
import TextBombRenderer from '../../../../components/TextBombRenderer';
import PostedPollEntity from '../PostedPollEntity';

export default function PostBody({
  id,
  item,
  isLargerThanScreen,
}: {
  id: string;
  item: IFeedItem;
  isLargerThanScreen: boolean;
}) {
  if (item.type === 'published-link') {
    return (
      <PostedLinkEntity
        isLargerThanScreen={isLargerThanScreen}
        feedItem={item as IPublishedLinkFeedItem}
      />
    );
  }

  if (item.type === 'published-post') {
    return <PostedPostEntity feedItem={item as IPublishedPostFeedItem} />;
  }

  if (item.type === 'published-text-bomb') {
    return (
      <TextBombRenderer
        text={(item as IPublishedTextBombFeedItem).payload.text}
        animationStyle="pop"
        inline
        delay={500}
      />
    );
  }

  if (item.type === 'published-poll') {
    return (
      <PostedPollEntity
        feedItemId={id}
        feedItem={item as IPublishedPollFeedItem}
      />
    );
  }

  return null;
}
