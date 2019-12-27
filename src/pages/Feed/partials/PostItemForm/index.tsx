import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import firebase from 'firebase/app';
import {
  IFeedItem,
  IFeedItemLinkPayload,
  IFeedItemPostPayload,
  IFeedItemPollPayload,
  IFeedItemTextBombPayload,
  TFeedItemType,
} from '@feedfarm-shared/types';
import styles from './index.module.scss';
import AddAsset from '../../../../components/LinkEditor';
import useCurrentUser from '../../../../hooks/use-current-user';
import Triangle from '../../../../components/Triangle';
import PostEditor from '../../../../components/PostEditor';
import useAnimateFeedItem from '../../hooks/use-animate-feed-item';
import useCurrentLanguage from '../../../../hooks/use-current-language';
import gsap from 'gsap';
import useIsMobile from '../../../../hooks/use-is-mobile';
import useFeed from '../../../../hooks/use-feed';
import UserPhoto from '../../../../components/UserPhoto';
import PollEditor from '../../../../components/PollEditor';
import TextBombEditor from '../../../../components/TextBombEditor';
import Icon from '../../../../components/Icon';
import { getUserRoles, canUserWrite } from '../../../../utils';
import { useTypedDispatch } from '../../../../state/reducer';
import { publishToFeed } from '../../../../firebase-functions';
import mergeRefs from 'typed-merge-refs';

function useAnimatePanes<T extends number>(panes: T[]) {
  const [paneIndex, setPaneIndex] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const refs = useRef<React.RefObject<HTMLDivElement>[]>([]);
  const focusRefs = useRef<React.RefObject<any>[]>([]);
  const duration = 0.4;
  const ease = 'back.out(1.7)';

  useEffect(() => {
    for (let i = 0; i < panes.length; i++) {
      refs.current.push(React.createRef<HTMLDivElement>());
      focusRefs.current.push(React.createRef<any>());
    }

    return () => {
      refs.current = [];
      focusRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (refs.current.findIndex(ref => !ref.current) === -1) {
      refs.current.forEach((ref, index) => {
        if (index !== 0) {
          ref.current!.style.opacity = '0';
          ref.current!.style.display = 'none';
        }
      });
    }
  }, [refs.current[0]]);

  function setPane(paneId: T) {
    gsap
      .to(refs.current[paneIndex].current!, {
        opacity: 0,
        duration,
        ease,
      })
      .then(() => {
        refs.current[paneIndex].current!.style.display = 'none';
        refs.current[paneId].current!.style.display = 'block';

        if (focusRefs.current[paneId].current?.focus) {
          focusRefs.current[paneId].current!.focus();
        }
      });

    refs.current[paneId].current!.style.display = 'block';

    gsap
      .fromTo(
        wrapper.current!,
        {
          height: refs.current[paneIndex].current?.getBoundingClientRect()
            .height,
        },
        {
          height: refs.current[paneId].current?.getBoundingClientRect().height,
          duration,
          delay: duration,
          // ease,
        },
      )
      .then(() => {
        gsap.fromTo(
          refs.current[paneId].current!,
          {},
          {
            opacity: 1,
            duration: 0,
          },
        );

        wrapper.current!.style.height = 'auto';

        const elements = [
          ...refs.current[paneId].current!.querySelectorAll(
            'div, input, button',
          ),
        ];
        gsap.fromTo(
          elements,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: 'elastic.out(1, 0.3)',
            onComplete: () => {
              elements.forEach((el: any) => {
                el.style.transform = '';
              });
            },
          },
        );
      });

    refs.current[paneId].current!.style.display = 'none';

    setPaneIndex(paneId);
  }

  return { wrapper, refs: refs.current, setPane, focusRefs: focusRefs.current };
}

enum Panes {
  main = 0,
  link = 1,
  post = 2,
  poll = 3,
  textBomb = 4,
}

export default function PostItemForm({ onSubmit }: { onSubmit?: () => void }) {
  const { t } = useTranslation();
  const [currentUser] = useCurrentUser();
  const { refs, focusRefs, setPane, wrapper } = useAnimatePanes<Panes>([
    Panes.main,
    Panes.link,
    Panes.post,
    Panes.poll,
    Panes.textBomb,
  ]);
  const isMobile = useIsMobile();
  const { isRtl } = useCurrentLanguage();
  const leftSideWrapper = useAnimateFeedItem({
    delay: 1,
  });
  const rightSideWrapper = useAnimateFeedItem({
    delay: 0.5,
  });
  const feed = useFeed();
  const dispatch = useTypedDispatch();

  async function handlePublishLink(asset: IFeedItemLinkPayload) {
    await publishToFeed({
      payload: asset,
      type: 'published-link',
      feedId: feed!.id,
    });

    if (onSubmit) {
      onSubmit();
    }

    setPane(Panes.main);
  }

  async function handlePublishPost(asset: IFeedItemPostPayload) {
    await publishToFeed({
      payload: asset,
      type: 'published-post',
      feedId: feed!.id,
    });

    onSubmit?.();

    setPane(Panes.main);
  }

  async function handlePublishPoll(asset: IFeedItemPollPayload) {
    await publishToFeed({
      payload: asset,
      type: 'published-poll',
      feedId: feed!.id,
    });

    onSubmit?.();
    setPane(Panes.main);
  }

  async function handlePublishTextBomb(asset: IFeedItemTextBombPayload) {
    await publishToFeed({
      payload: asset,
      type: 'published-text-bomb',
      feedId: feed!.id,
    });

    onSubmit?.();
    setPane(Panes.main);
  }

  function handlePostClick() {
    setPane(Panes.post);
  }

  function handleLinkClick() {
    setPane(Panes.link);
  }

  function handlePollClick() {
    setPane(Panes.poll);
  }

  function handleTextBombClick() {
    setPane(Panes.textBomb);
  }

  function handleImageClick() {
    dispatch({
      type: 'show-priority-feedback-modal',
      payload: { featureType: 'post-image' },
    });
  }

  function handleVideoClick() {
    dispatch({
      type: 'show-priority-feedback-modal',
      payload: { featureType: 'post-video' },
    });
  }

  function handleBackClick() {
    setPane(Panes.main);
  }

  const buttons: {
    handler: () => void;
    icon: string;
    label: string;
    type: TFeedItemType | 'published-image' | 'published-video';
  }[] = [];

  function feedAllows(feedItemType: TFeedItemType) {
    return feed?.allowedFeedItemTypes.indexOf(feedItemType) !== -1;
  }

  if (feedAllows('published-post')) {
    buttons.push({
      handler: handlePostClick,
      icon: `fa fa-align-${isRtl ? 'right' : 'left'}`,
      label: t('Post'),
      type: 'published-post',
    });
  }
  if (feedAllows('published-link')) {
    buttons.push({
      handler: handleLinkClick,
      icon: `fa fa-link`,
      label: t('Link'),
      type: 'published-link',
    });
  }
  if (feedAllows('published-poll')) {
    buttons.push({
      handler: handlePollClick,
      icon: `fa fa-poll`,
      label: t('Poll'),
      type: 'published-poll',
    });
  }
  if (feedAllows('published-text-bomb')) {
    buttons.push({
      handler: handleTextBombClick,
      icon: `fa fa-bomb`,
      label: t('Text Bomb'),
      type: 'published-text-bomb',
    });
  }
  buttons.push({
    handler: handleImageClick,
    icon: `fa fa-image`,
    label: t('Image'),
    type: 'published-image',
  });
  buttons.push({
    handler: handleVideoClick,
    icon: `fa fa-video`,
    label: t('Video'),
    type: 'published-video',
  });

  useEffect(() => {
    if (buttons.length === 1) {
      switch (buttons[0].type) {
        case 'published-link':
          setPane(Panes.link);
          break;
        case 'published-post':
          setPane(Panes.post);
          break;
        case 'published-poll':
          setPane(Panes.poll);
          break;
        case 'published-text-bomb':
          setPane(Panes.textBomb);
          break;
      }
    }
  }, [buttons.length]);

  if (!canUserWrite(feed, currentUser)) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {!isMobile && (
        <UserPhoto
          ref={leftSideWrapper as any}
          className={styles.userPhoto}
          photo={currentUser?.userPhoto}
          size="md"
        />
      )}

      <div
        ref={mergeRefs(wrapper, rightSideWrapper)}
        className={styles.formWrapper}
      >
        {/* {!isMobile && (
          <Triangle
            className={styles.triangle}
            stroke="var(--post-border-color)"
            fill="var(--post-bg)"
            animate={false}
          />
        )} */}
        <div ref={refs[0]}>
          <div className={styles.title}>
            {t('postItemForm.title', 'What would you like to share?')}
          </div>
          <div
            className={cx(
              styles.postTypeSelector,
              buttons.length > 2 && styles.twoLines,
            )}
          >
            {buttons.map(button => (
              <button
                key={button.type}
                className={styles.postTypeButton}
                onClick={button.handler}
              >
                <Icon icon={button.icon} variant="emblem" />
                <div className={styles.label}>{button.label}</div>
              </button>
            ))}
          </div>
        </div>
        <div ref={refs[1]}>
          <AddAsset
            ref={focusRefs[1]}
            onAdd={handlePublishLink}
            onCancel={handleBackClick}
          />
        </div>
        <div ref={refs[2]}>
          <PostEditor
            ref={focusRefs[2]}
            onAdd={handlePublishPost}
            onCancel={handleBackClick}
          />
        </div>
        <div ref={refs[3]}>
          <PollEditor
            ref={focusRefs[3]}
            onAdd={handlePublishPoll}
            onCancel={handleBackClick}
          />
        </div>
        <div ref={refs[4]}>
          <TextBombEditor
            ref={focusRefs[4]}
            onAdd={handlePublishTextBomb}
            onCancel={handleBackClick}
          />
        </div>
      </div>
    </div>
  );
}
