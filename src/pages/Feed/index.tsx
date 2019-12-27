import React, { useState, useEffect } from 'react';
import { IFeedItem, IFeed } from '@feedfarm-shared/types';
import firebase from 'firebase/app';
import styles from './index.module.scss';
import useContentSizer from '../../hooks/use-content-sizer';
import useIsMobile from '../../hooks/use-is-mobile';
import FeedItem from './partials/Post';
import PostItemForm from './partials/PostItemForm';
import useIntersectionObserver from '@react-hook/intersection-observer';
import Footer from '../../components/Footer';
import useFeed from '../../hooks/use-feed';
import OwnerTools from '../../components/OwnerTools';
import useThemeSetter from '../../hooks/use-theme-setter';
import { useIsFeedPrivate } from '../../state/feed';
import PrivateFeed from '../../components/PrivateFeed';
import { useRouteMatch } from 'react-router-dom';
import { useTypedDispatch } from '../../state/reducer';
import { getFeedId } from '../../firebase-functions';

export default function Feed() {
  const [wrapper] = useContentSizer();
  const [feedItems, setFeedItems] = useState<{ id: string; data: IFeedItem }[]>(
    [],
  );
  const [showMoreEntry, showMoreRef] = useIntersectionObserver();
  const [limit, setLimit] = useState(2);
  const isMobile = useIsMobile();
  const feed = useFeed();
  const isFeedPrivate = useIsFeedPrivate();
  useThemeSetter();

  const routeMatch = useRouteMatch<{ feedName: string }>();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    // if (!hasRequestedData) {
    // hasRequestedData = true;
    setFeedItems([]);
    getFeedId({ feedName: routeMatch?.params.feedName! })
      .then(res => {
        return firebase
          .firestore()
          .doc(`/feeds/${res.feedId}`)
          .get();
      })
      .then(feed => {
        dispatch({
          type: 'set-feed',
          payload: { feed: feed.data() as IFeed },
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'set-feed-is-private' });
      });
    // }
  }, [routeMatch?.params.feedName]);

  useEffect(() => {
    if (!feed) {
      return;
    }

    // debugger;
    return (
      firebase
        .firestore()
        .collection(`/feeds/${feed.id}/posts`)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        // .get()
        // .then(feed => {
        .onSnapshot(newFeed => {
          // debugger;

          // if (newFeed.metadata.fromCache && newFeed.docs.length === 1) {
          //   return;
          // }

          setFeedItems(
            newFeed.docs.map(doc => ({
              id: doc.id,
              data: doc.data() as IFeedItem,
            })),
            // .reverse(),
          );
        })
    );
  }, [limit, feed]);

  useEffect(() => {
    if (feedItems.length === 0) {
      return;
    }

    if (showMoreEntry.isIntersecting) {
      setLimit(limit => limit + 5);
    }
  }, [showMoreEntry]);

  if (isFeedPrivate) {
    return <PrivateFeed />;
  }

  if (!feed) {
    return null;
  }

  return (
    <div ref={wrapper} className={styles.wrapper}>
      <OwnerTools />
      {!isMobile && <Footer layout="sidebar" />}
      <PostItemForm />
      {feedItems.map((post, index) => (
        <FeedItem
          isFirst={false && index === 0}
          key={post.id}
          id={post.id}
          item={post.data}
        />
      ))}
      <div ref={showMoreRef as any}></div>
    </div>
  );
}
