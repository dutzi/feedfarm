import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import firebase from 'firebase/app';
import styles from './index.module.scss';
import useIntersectionObserver from '@react-hook/intersection-observer';
import { IPostComment } from '@feedfarm-shared/types';
import Comment from '../Comment';
import CommentEditor from '../CommentEditor';
import useProcessing from '../../../../hooks/use-processing';
import useFeed from '../../../../hooks/use-feed';
import useAnimateHeight from '../../../../hooks/use-animate-height';
import Spinner from '../../../../components/Spinner';

function mapFirebaseItem<T>(collection: firebase.firestore.QuerySnapshot) {
  return collection.docs.map(doc => ({
    data: doc.data() as T,
    id: doc.id,
  }));
}

export default function CommentsSection({ postId }: { postId: string }) {
  const { t } = useTranslation();
  const [entry, observerRef] = useIntersectionObserver();
  const processingMount = useProcessing();
  const processingMore = useProcessing();
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [limit, setLimit] = useState(5);
  const [comments, setComments] = useState<
    { id: string; data: IPostComment }[]
  >([]);
  const feed = useFeed();
  const [commentsWrapper, commentsList] = useAnimateHeight();

  // const commentsList = useRef<HTMLDivElement>(null);
  // const [dimensions, setDimensions] = useState<DOMRectReadOnly>();
  // const dimensions = useRef<DOMRectReadOnly>();
  // const isAnimating = useRef(false);

  // useEffect(() => {
  //   if (!commentsList.current) {
  //     return;
  //   }

  //   const resizeObserver = new ResizeObserver((entries, wtf) => {
  //     console.log('here!!!');
  //     if (dimensions.current && !isAnimating.current) {
  //       console.log('animated!', dimensions.current.height);
  //       isAnimating.current = true;
  //       gsap
  //         .timeline()
  //         .fromTo(
  //           commentsList.current!,
  //           { height: dimensions.current.height },
  //           {
  //             height: 'auto',
  //             duration: 1,
  //           },
  //         )
  //         .then(() => {
  //           isAnimating.current = false;
  //         });
  //     }

  //     dimensions.current = entries[0].contentRect;
  //   });

  //   resizeObserver.observe(commentsList.current);

  //   return () => {
  //     if (commentsList.current) {
  //       resizeObserver.unobserve(commentsList.current);
  //     }
  //   };
  // }, [commentsList.current]);

  useEffect(() => {
    if (!entry.isIntersecting) {
      return;
    }

    processingMount.start();
    return (
      firebase
        .firestore()
        .collection(`feeds/${feed?.id}/posts/${postId}/comments`)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        // .get()
        // .then(feed => {
        .onSnapshot(comments => {
          processingMount.stop();
          processingMore.stop();
          setHasLoadedComments(true);
          setComments(mapFirebaseItem<IPostComment>(comments).reverse());
        })
    );
  }, [entry, limit]);

  function handleShowMoreComments() {
    setLimit(limit + 5);
    processingMore.start();
  }

  function hasMoreComments() {
    return comments.length === limit;
  }

  if (!feed?.allowsCommenting) {
    return null;
  }

  return (
    <div ref={observerRef as any} className={styles.wrapper}>
      {/* {processingMount.state && !hasLoadedComments && (
        <Spinner className={styles.spinner} size="sm" center />
      )} */}
      {((hasLoadedComments && comments.length === 0) || !hasLoadedComments) && (
        <div className={styles.noComment}>
          {hasLoadedComments && comments.length === 0 && t('(no comments)')}
          {!hasLoadedComments && t('(loading comments)')}
        </div>
      )}
      {hasLoadedComments && (hasMoreComments() || processingMore.state) && (
        <button
          className={styles.showMoreCommentsButton}
          onClick={handleShowMoreComments}
        >
          {processingMore.state ? (
            <Spinner
              className={styles.showMoreCommentsSpinner}
              size="sm"
              center
            />
          ) : (
            t('Show Previous Comments')
          )}
        </button>
      )}

      <div ref={commentsWrapper}>
        <div ref={commentsList} className={styles.commentsList}>
          {comments.map(comment => (
            <Comment key={comment.id} id={comment.id} data={comment.data} />
          ))}
        </div>
      </div>

      <CommentEditor
        postId={postId}
        placeholder={
          comments.length > 0
            ? t('Share your thoughts...')
            : t('Be the first to comment...')
        }
      />
    </div>
  );
}
