import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import firebase from 'firebase/app';
import { IPublishedPollFeedItem } from '@feedfarm-shared/types';
import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';
import Odometer from 'react-odometerjs';
import useFeed from '../../../../hooks/use-feed';
import gsap from 'gsap';
import {
  submitPollAnswer,
  getPollResults,
} from '../../../../firebase-functions';

function getCSSVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

interface IDistribution {
  [key: string]: number;
}

function parseDistribution(distribution: IDistribution, numAnswers: number) {
  const filledDistribution = new Array(numAnswers).fill(0) as number[];

  Object.keys(distribution).forEach(
    key => (filledDistribution[Number(key)] = distribution[key]),
  );

  return filledDistribution;
}

export default function PostedPollEntity({
  feedItem,
  feedItemId,
}: {
  feedItem: IPublishedPollFeedItem;
  feedItemId: string;
}) {
  const { t } = useTranslation();
  const feed = useFeed();
  const wrapper = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState(0);
  const [distribution, setDistribution] = useState<number[]>([]);

  useEffect(() => {
    getPollResults({
      feedId: feed!.id,
      feedItemId,
    }).then(res => {
      const distribution = res.distribution as IDistribution | undefined;

      if (distribution) {
        showResults(
          parseDistribution(distribution, feedItem.payload.answers.length),
        );
      }
    });
  }, [feed, feedItemId, feedItem.answerCount]);

  function getNumVoters(distribution: number[]) {
    return distribution.reduce((prev, current) => prev + current, 0);
  }

  function showResults(distribution: number[]) {
    setAnimationState(1);
    setDistribution(distribution);

    const count = getNumVoters(distribution);

    setTimeout(() => {
      setAnimationState(2);
      if (!wrapper.current) {
        return;
      }

      return [...wrapper.current.querySelectorAll('button')]
        .map((button, index) => {
          return gsap.timeline().fromTo(
            button,
            {
              boxShadow: '0px 0px #00000054',
              background: getCSSVar('--feedfarm-cyan'),
            },
            {
              width: (distribution[index] / count) * 85 + '%',
              padding: '5px 6px',
              duration: 2,
            },
          );
        })[0]
        .then(() => {
          if (!wrapper.current) {
            return;
          }

          [...wrapper.current.querySelectorAll('button')].forEach(
            button => (button.style.overflow = 'initial'),
          );
          gsap
            .timeline()
            .to(wrapper.current.querySelectorAll('[data-answer-wrapper]'), {
              marginBottom: 32,
              duration: 1,
            });

          return gsap
            .timeline()
            .to(wrapper.current.querySelectorAll('button > div'), {
              y: 36,
              x: -7,
              scale: 0.8,
              duration: 1,
            });
        });
    }, 100);
  }

  function submitAnswer(answerIndex: number) {
    Promise.all([
      submitPollAnswer({
        feedId: feed!.id,
        feedItemId,
        answerIndex,
      }),
      gsap
        .timeline()
        .to(wrapper.current!.querySelectorAll('button'), {
          background: getCSSVar('--feedfarm-cyan'),
        })
        .then(() => {
          return [...wrapper.current!.querySelectorAll('button')].map(
            button => {
              return gsap.timeline().to(button, {
                width: 0,
                duration: 1,
                padding: '5px 0px',
                boxShadow: '0px 0px #00000054',
                delay: 0.4,
              });
            },
          )[1];
        }),
    ]).then(([res]) => {
      if (!('error' in res)) {
        showResults(
          parseDistribution(res.distribution, feedItem.payload.answers.length),
        );
      }
    });
  }

  const numVoters = getNumVoters(distribution);

  return (
    <div
      ref={wrapper}
      className={cx(
        styles.wrapper,
        animationState > 0 && styles.showingResults,
      )}
    >
      {feedItem.payload.answers.map((answer, index) => (
        <div key={answer} className={styles.answerWrapper} data-answer-wrapper>
          <button
            key={answer}
            className={styles.answer}
            onClick={submitAnswer.bind(null, index)}
            disabled={animationState !== 0}
          >
            <div className={styles.label}>{answer}</div>
          </button>
          {animationState !== 0 && (
            <div className={styles.odometer}>
              <Odometer
                selector={'.my-numbers'}
                value={
                  animationState < 2
                    ? 0
                    : (distribution[index] / numVoters) * 100
                }
                format="(,ddd).dd"
                duration={2000}
              />
              %
            </div>
          )}
        </div>
      ))}
      <Odometer
        value={feedItem.answerCount}
        format="(,ddd).dd"
        duration={250}
      />{' '}
      {t('pollFeedItem.answerCount', 'voted users', {
        count: feedItem.answerCount,
      })}
    </div>
  );
}
