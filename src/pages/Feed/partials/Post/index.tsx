import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/app';
import { IFeedItem, IPublishedTextBombFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import CommentsSection from '../CommentsSection';
import Reactions from '../Reactions';
import useAnimateFeedItem from '../../hooks/use-animate-feed-item';
import useIsMobile from '../../../../hooks/use-is-mobile';
import useCurrentLanguage from '../../../../hooks/use-current-language';
import useCurrentUser from '../../../../hooks/use-current-user';
import useFeed from '../../../../hooks/use-feed';
import ResizeObserver from '@juggle/resize-observer';
import UserPhoto from '../../../../components/UserPhoto';
import TextBombFeedItemDelayer from '../TextBombFeedItemDelayer';
import PostTriangle from '../PostTriangle';
import PostMetadata from '../PostMetadata';
import PostTitle from '../PostTitle';
import PostBody from '../PostBody';
import PostTags from '../PostTags';
import { TAction } from '../ContextMenu';
import { useTypedDispatch } from '../../../../state/reducer';
import { deletePost as firebaseDeletePost } from '../../../../firebase-functions';
// import { ReactComponent as ContextMenu } from '../../../../components/Icons/menu-test.svg';

export default function Post({
  id,
  item,
  isFirst,
  isSticky,
}: {
  id: string;
  item: IFeedItem;
  isFirst: boolean;
  isSticky?: boolean;
}) {
  const wrapperResizeRef = useRef<HTMLDivElement>(null);
  const [isLargerThanScreen, setIsLargerThanScreen] = useState(false);
  const leftSideWrapper = useAnimateFeedItem({ delay: isFirst ? 1 : 0.166 });
  const rightSideWrapper = useAnimateFeedItem({ delay: isFirst ? 2 : 0.333 });
  const isMobile = useIsMobile();
  const { isRtl } = useCurrentLanguage();
  const [currentUser] = useCurrentUser();
  const [showContextMenuSpinner, setShowContextMenuSpinner] = useState();
  const feed = useFeed();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (!wrapperResizeRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(entries => {
      setIsLargerThanScreen(
        !isMobile && entries[0].contentRect.height > window.innerHeight,
      );
    });

    resizeObserver.observe(wrapperResizeRef.current);

    return () => {
      if (wrapperResizeRef.current) {
        resizeObserver.unobserve(wrapperResizeRef.current);
      }
    };
  }, [wrapperResizeRef.current]);

  async function deletePost() {
    setShowContextMenuSpinner(true);
    await firebaseDeletePost({
      postId: id,
      feedId: feed!.id,
    });
    setShowContextMenuSpinner(true);
  }

  async function banUser() {
    dispatch({
      type: 'show-priority-feedback-modal',
      payload: { featureType: 'banned-users' },
    });
    // setShowContextMenuSpinner(true);
    // await firebase.functions().httpsCallable('banUser')({
    //   uid: item.uid,
    //   feedId: feed?.id,
    // });
    // setShowContextMenuSpinner(true);
  }

  function viewPostInDB() {
    window.open(
      'https://console.firebase.google.com/u/0/project/feedfarm-app/database/firestore/data' +
        window
          .encodeURIComponent(`/feeds/${feed?.id}/posts/${id}`)
          .replace(/%/g, '~'),
    );
  }

  function handleContextMenuSelect(action: TAction) {
    if (action === 'delete') {
      deletePost();
    } else if (action === 'ban') {
      banUser();
    } else if (action === 'view-in-db') {
      viewPostInDB();
    }
  }

  const postTypeIndicator = (() => {
    switch (item.type) {
      case 'published-post':
        return `align-${isRtl ? 'right' : 'left'}`;
      case 'published-link':
        return 'link';
      case 'published-poll':
        return 'poll';
      case 'published-text-bomb':
        return 'bomb';
      case 'user-joined':
        return 'user-plus';
    }
  })();

  // const isMine = item.uid === currentUser?.id && id !== 'ydViqh0fSf0hZHHJ0GtD';

  function renderRightSide() {
    const content = (
      <div ref={rightSideWrapper} className={styles.post}>
        <PostTriangle />

        <PostMetadata
          item={item}
          isSticky={isSticky}
          onContextMenuSelect={handleContextMenuSelect}
          showContextMenuSpinner={showContextMenuSpinner}
        />

        <PostTitle item={item} />

        <PostBody id={id} item={item} isLargerThanScreen={isLargerThanScreen} />

        <PostTags item={item} />

        <Reactions
          reactions={item.reactions ?? []}
          postId={id}
          // isSticky={isSticky && shouldStick}
        />
        <CommentsSection postId={id} />
      </div>
    );

    if (item.type === 'published-text-bomb') {
      return (
        <TextBombFeedItemDelayer feedItem={item as IPublishedTextBombFeedItem}>
          {content}
        </TextBombFeedItemDelayer>
      );
    } else {
      return content;
    }
  }

  return (
    <div ref={wrapperResizeRef} className={styles.wrapper}>
      <div className={styles.content}>
        {!isMobile && (
          <div>
            <UserPhoto
              ref={leftSideWrapper as any}
              className={styles.userPhoto}
              photo={item.userPhoto || '!purple-soccer'}
              size="md"
            />

            <div className={styles.postTypeIndicator}>
              <i className={`fa fa-${postTypeIndicator}`} />
            </div>
          </div>
        )}
        {renderRightSide()}
        {/* <div ref={contextMenu} className={styles.contextMenu}>
          <ContextMenu />
        </div> */}
      </div>
    </div>
  );
}
