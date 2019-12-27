import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import styles from './index.module.scss';
import Modal from '../Modal';
import { Trans, useTranslation } from 'react-i18next';
import { useTypedSelector, useTypedDispatch } from '../../state/reducer';
import { Emoji } from 'emoji-mart';
import { useAnimate } from './hooks';
import { TFeatureResponseType } from '@feedfarm-shared/types';
import { useAnimationRef } from '../../utils';
import gsap from 'gsap';
import Physics2DPlugin from 'gsap/Physics2DPlugin';
import { submitFeaturePriorityResponse } from '../../firebase-functions';

gsap.registerPlugin(Physics2DPlugin);

export default function PriorityFeedbackModal() {
  const { t } = useTranslation();
  const priorityFeedbackModal = useTypedSelector(
    state => state.ui.priorityFeedbackModal,
  );
  const dispatch = useTypedDispatch();
  const animation = useAnimate(priorityFeedbackModal.show);
  const modal = useAnimationRef<any>();

  function handleClose() {
    dispatch({ type: 'hide-priority-feedback-modal' });
  }

  useEffect(() => {
    if (priorityFeedbackModal.show) {
      submitFeaturePriorityResponse({
        featureType: priorityFeedbackModal.featureType!,
        response: 'saw',
      });
    }
  }, [priorityFeedbackModal]);

  let featureName;

  switch (priorityFeedbackModal.featureType) {
    case 'user-profile':
      featureName = t('User profiles');
      break;
    case 'banned-users':
      featureName = t('Banned users');
      break;
    case 'post-image':
      featureName = t('Image posts');
      break;
    case 'post-video':
      featureName = t('Video posts');
      break;
  }

  function handleClick(response: TFeatureResponseType, e: React.MouseEvent) {
    submitFeaturePriorityResponse({
      featureType: priorityFeedbackModal.featureType!,
      response,
    });

    // create 80 dot elements and put them in an array
    let dots = [];
    for (let i = 0; i < 80; i++) {
      let dot = document.createElement('div');
      dot.setAttribute('class', styles.dot);
      e.currentTarget.appendChild(dot);
      dots.push(dot);
      dot.innerText = '🙏';
      // dot.innerText = {
      //   'not-likely': '👎',
      //   maybe: '🧐',
      //   'very-likely': '👍',
      // }[response];
    }

    gsap.set(dots, {
      scale: 'random(0.4, 1)',
      x: 0,
      y: 0,
    });

    gsap.to(dots, {
      duration: 2,
      physics2D: {
        velocity: 'random(200, 500)',
        angle: 'random(180, 360)',
        gravity: 500,
      },
      opacity: 0,
      delay: 'random(0, 0.5)',
    });

    setTimeout(() => {
      modal.current.animateLeave('pop').then(handleClose);
    }, 1500);
  }

  return (
    <Modal
      show={priorityFeedbackModal.show}
      onClose={handleClose}
      ref={modal}
      showClose
      title={`Coming Soon...`}
    >
      <div className={styles.wrapper}>
        <div className={styles.title}></div>
        <div className={styles.body}>
          <span>{featureName} </span>
          <Trans i18nKey="priorityFeedbackModal.body1">are coming soon!</Trans>
        </div>
        <div className={styles.body}>
          <Trans i18nKey="priorityFeedbackModal.body2">
            Got a second? Help us prioritize our to do list by voting for it.
          </Trans>
        </div>
        <div className={styles.body}>
          <Trans i18nKey="priorityFeedbackModal.body3">
            How likely you are to use this feature?
          </Trans>
        </div>
        <div className={styles.rating} ref={animation.refs.rating}>
          <button
            className={styles.ratingButton}
            onClick={handleClick.bind(null, 'not-likely')}
          >
            <div className={styles.value}>
              <Emoji emoji="-1" size={30} />
            </div>
            <div className={styles.label}>{t('Not Likely')}</div>
          </button>
          <button
            className={styles.ratingButton}
            onClick={handleClick.bind(null, 'maybe')}
          >
            <div className={styles.value}>
              <Emoji emoji="thinking_face" size={30} />
            </div>
            <div className={styles.label}>{t('Maybe')}</div>
          </button>
          <button
            className={styles.ratingButton}
            onClick={handleClick.bind(null, 'very-likely')}
          >
            <div className={styles.value}>
              <Emoji emoji="+1" size={30} />
            </div>
            <div className={styles.label}>{t('Very Likely')}</div>
          </button>
        </div>
      </div>
    </Modal>
  );
}
