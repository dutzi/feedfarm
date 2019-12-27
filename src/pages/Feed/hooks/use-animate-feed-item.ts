import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import useIntersectionObserver from '@react-hook/intersection-observer';
import useCurrentLanguage from '../../../hooks/use-current-language';
import mergeRefs from 'typed-merge-refs';

export default function useAnimateFeedItem(
  { delay }: { delay: number } = { delay: 0 },
) {
  const [wrapperEntry, wrapperIORef] = useIntersectionObserver() as [
    IntersectionObserverEntry,
    any,
  ];
  const wrapper = useRef<HTMLDivElement>(null);
  const { isRtl } = useCurrentLanguage();
  const [timeline, setTimeline] = useState<gsap.core.Timeline>();

  useEffect(() => {
    if (wrapperEntry.isIntersecting && timeline) {
      timeline.play();
    }
  }, [wrapperEntry, timeline]);

  useEffect(() => {
    if (wrapper.current) {
      const shadowOffset = isRtl ? '-5px' : '5px';
      const timeline = gsap
        .timeline()
        .fromTo(
          wrapper.current,
          {
            opacity: 0.1,
            boxShadow: '0px 0px #0000004d',
            filter: 'brightness(0)',
            x: isRtl ? -5 : 5,
            y: 5,
          },
          {
            delay: delay,
            opacity: 1,
            boxShadow: `${shadowOffset} 5px #0000004d`,
            duration: 0.5,
            filter: 'brightness(1)',
            x: 0,
            y: 0,
            ease: 'back.out(1.7)',
          },
        )
        .pause();

      timeline.then(() => {
        if (wrapper.current) {
          Object.assign(wrapper.current?.style, {
            transform: 'none',
            filter: 'none',
          });
        }
      });

      setTimeline(timeline);
    }
  }, [wrapper.current]);

  return mergeRefs(wrapperIORef, wrapper) as React.Ref<HTMLDivElement>;
}
