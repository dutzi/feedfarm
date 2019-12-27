import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import firebase from 'firebase/app';
import { IPostReaction, IUser } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import 'emoji-mart/css/emoji-mart.css';
import { Picker, Emoji } from 'emoji-mart';
import Odometer from 'react-odometerjs';
import Spinner from '../../../../components/Spinner';
import useCurrentUser from '../../../../hooks/use-current-user';
import useFeed from '../../../../hooks/use-feed';
import { getReactionAttributions } from '../../../../firebase-functions';

const NUM_ATTRIBUTIONS = 10;

type TReactionsAttributions = string[];

export default function Reaction({
  reaction,
  onClick,
  postId,
}: {
  reaction: IPostReaction;
  onClick: (emoji: { id: string }, fromEmojis: boolean) => void;
  postId: string;
}) {
  const { t } = useTranslation();
  const [currentUser] = useCurrentUser();
  const [reactionsAttributions, setReactionsAttributions] = useState<
    TReactionsAttributions
  >();
  const [processedEmoji, setProcessedEmoji] = useState<string>();

  const feed = useFeed();

  async function handleSelect() {
    setReactionsAttributions(undefined);

    onClick({ id: reaction.type }, true);
  }

  useEffect(() => {
    setReactionsAttributions(undefined);
  }, [reaction]);

  async function handleReactionMouseOver() {
    if (reactionsAttributions) {
      return;
    }

    const { usernames } = await getReactionAttributions({
      postId: postId,
      emojiId: reaction.type,
      feedId: feed!.id,
    });

    setReactionsAttributions(usernames);
  }

  function getTooltip(reaction: IPostReaction) {
    const usernames = reactionsAttributions?.join(', ');
    if (reactionsAttributions?.length! < reaction.count) {
      return (
        usernames +
        ' ' +
        t('and {{numVoters}} more', {
          numVoters: reaction.count - NUM_ATTRIBUTIONS,
          count: reaction.count - NUM_ATTRIBUTIONS,
        })
      );
    } else {
      return usernames;
    }
  }

  return (
    <button
      key={reaction.type}
      className={styles.wrapper}
      onClick={handleSelect}
      onMouseOver={handleReactionMouseOver}
      onFocus={handleReactionMouseOver}
      aria-label={getTooltip(reaction)}
      data-balloon-multiline
      data-balloon-pos="up"
    >
      <Emoji set="apple" emoji={reaction.type} size={20} />
      {processedEmoji === reaction.type ? (
        <Spinner className={styles.spinner} size="x-sm" />
      ) : (
        <span className={styles.count}>
          <Odometer value={reaction.count} format="(,ddd).dd" duration={250} />
        </span>
      )}
    </button>
  );
}
