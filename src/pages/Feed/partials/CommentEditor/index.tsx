import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/app';
import { IFeedItem, TFeedItemType } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import Triangle from '../../../../components/Triangle';
// import TimeAgo from '../../../Notifications/partials/TimeAgo';
// import LabelledInput from '../../components/LabelledInput';
// import Label from '../../components/Label';
// import Select from '../../components/Select';
// import PhotoBucketList from '../../components/PhotoBucketList';
import { IPostComment } from '@feedfarm-shared/types';
import Comment from '../Comment';
// import SubmitButton from '../../components/SubmitButton';
// import LookingFor from '../../components/LookingFor';
// import LabelledTextarea from '../../components/LabelledTextarea';
// import Button from '../../components/Button';
// import withProfile from './with-profile';
import useCurrentUser from '../../../../hooks/use-current-user';
import useFeed from '../../../../hooks/use-feed';
import useProcessing from '../../../../hooks/use-processing';
import TextareaAutosize from 'react-autosize-textarea';
import gsap from 'gsap';
import UserPhoto from '../../../../components/UserPhoto';
import { canUserWrite } from '../../../../utils';
import { submitComment } from '../../../../firebase-functions';

// import { updateCurrentUser } from '../../state/actions';
// import { Trans, useTranslation } from 'react-i18next';
// import MessageBox from '../../components/MessageBox';

function mapFirebaseItem<T>(collection: firebase.firestore.QuerySnapshot) {
  return collection.docs.map(doc => ({
    data: doc.data() as T,
    id: doc.id,
  }));
}

export default function CommentEditor({
  postId,
  placeholder,
}: {
  postId: string;
  placeholder: string;
}) {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentUser] = useCurrentUser();
  const processing = useProcessing();
  const textareaWrapper = useRef<HTMLDivElement>(null);
  const triangle = useRef<HTMLDivElement>(null);
  const timelines = useRef<gsap.core.Timeline[]>([]);
  const feed = useFeed();

  async function handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode === 13 && !e.shiftKey) {
      if (currentUser && comment.trim().length) {
        e.preventDefault();

        processing.start();
        setIsFocused(false);

        await submitComment({
          feedId: feed!.id,
          message: comment.trim(),
          postId,
        });

        setComment('');

        processing.stop();
        setIsFocused(false);
      }
    }
  }

  useEffect(() => {
    if (textareaWrapper.current && triangle.current) {
      if (processing.state) {
        gsap.timeline();
        timelines.current.push(
          gsap
            .timeline()
            .fromTo(
              textareaWrapper.current,
              {
                filter: 'brightness(1)',
              },
              {
                filter: 'brightness(0)',
                opacity: 0.3,
                duration: 0.3,
              },
            )
            .to(textareaWrapper.current, {
              delay: 1,
              scale: 0.8,
              opacity: 0,
              duration: 0.3,
              ease: 'back.in(2)',
            }),
        );
      } else {
        timelines.current?.forEach(timeline => timeline.pause());
        textareaWrapper.current.style.filter = '';
        textareaWrapper.current.style.opacity = '';
        textareaWrapper.current.style.transform = '';
      }
    }
  }, [processing.state]);

  function handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setComment(e.target.value);
  }

  if (!canUserWrite(feed, currentUser)) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <UserPhoto
        size="sm"
        photo={currentUser?.userPhoto}
        className={styles.userPhoto}
      />
      <div ref={textareaWrapper} className={styles.textareaWrapper}>
        <Triangle
          ref={triangle}
          className={styles.triangle}
          fill="var(--comment-editor-bg-color)"
          stroke={
            isFocused && !processing.state
              ? 'var(--feedfarm-primary)'
              : 'var(--comment-editor-border-color)'
          }
          innerShadow="var(--input-box-shadow-color)"
        />
        <TextareaAutosize
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={styles.textarea}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          value={comment}
          onChange={handleCommentChange}
          disabled={processing.state}
        />
      </div>
    </div>
  );
}
