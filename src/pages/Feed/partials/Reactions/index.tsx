import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import firebase from 'firebase/app';
import { IPostReaction } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import { Picker } from 'emoji-mart';
import Spinner from '../../../../components/Spinner';
import useFeed from '../../../../hooks/use-feed';
import getEmojiMartI18n from './get-emoji-mart-i18n';
import Reaction from '../Reaction';
import 'emoji-mart/css/emoji-mart.css';
import './odometer.css';
import './emoji-mart.css';
import { canUserWrite } from '../../../../utils';
import useCurrentUser from '../../../../hooks/use-current-user';
import { toggleReaction } from '../../../../firebase-functions';

export default function Reactions({
  reactions,
  postId,
  isSticky,
}: {
  reactions: IPostReaction[];
  postId: string;
  isSticky?: boolean;
}) {
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const [processedEmoji, setProcessedEmoji] = useState<string>();
  const [currentUser] = useCurrentUser();
  function handleShowPicker() {
    setShowPicker(true);
  }
  const feed = useFeed();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLDivElement).closest('[data-dont-close-picker]')) {
        setShowPicker(false);
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  async function handleSelect(emoji: any, fromEmojis?: boolean) {
    setShowPicker(false);
    setProcessedEmoji('__picker');
    await toggleReaction({
      emojiId: emoji.id,
      postId,
      feedId: feed!.id,
    });
    setProcessedEmoji(undefined);
  }

  if (!feed?.allowsReactions) {
    return null;
  }

  function renderPicker() {
    if (!canUserWrite(feed, currentUser)) {
      return null;
    }

    return (
      <div className={styles.pickerButtonWrapper} data-dont-close-picker>
        <button
          className={cx(styles.reactionButton, styles.addReactionButton)}
          onClick={handleShowPicker}
        >
          <i className="fa fa-smile" />
          {processedEmoji === '__picker' ? (
            <Spinner className={styles.spinner} size="x-sm" />
          ) : (
            <i className="fa fa-plus" />
          )}
        </button>
        {showPicker && (
          <div className={styles.pickerWrapper}>
            <Picker
              autoFocus
              onSelect={handleSelect}
              showSkinTones={false}
              showPreview={false}
              i18n={getEmojiMartI18n(t)}
              color={getComputedStyle(
                document.documentElement,
              ).getPropertyValue('--feedfarm-cyan')}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cx(styles.wrapper, isSticky && styles.isSticky)}>
      {reactions
        .filter(reaction => reaction.count)
        .map(reaction => (
          <Reaction
            key={reaction.type}
            reaction={reaction}
            onClick={handleSelect}
            postId={postId}
          />
        ))}
      {renderPicker()}
    </div>
  );
}
