import { useEffect, useRef, useImperativeHandle, useCallback } from 'react';
import { TPaneType } from './types';
import useCurrentLanguage from '../../hooks/use-current-language';

export function usePaneAnimator({
  pane,
  wrapper,
}: {
  pane: TPaneType;
  wrapper: React.RefObject<HTMLDivElement>;
}) {
  const shiftToPaneTimeline = useRef<gsap.core.Timeline>();
  const prevPane = useRef<TPaneType>('main');
  const well = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const panes = {
    style: useRef<any>(null),
    rules: useRef<any>(null),
    roles: useRef<any>(null),
    general: useRef<any>(null),
  } as { [key in TPaneType]: React.RefObject<any> };
  const { isRtl } = useCurrentLanguage();

  useEffect(() => {
    if (pane !== 'main') {
      shiftToPaneTimeline.current = gsap
        .timeline()
        .to(toolbar.current!, {
          x: -70 * (isRtl ? -1 : 1),
          duration: 0.4,
          ease: 'back.in(1.3)',
        })
        .to(well.current!, {
          width: 300,
          duration: 0.4,
          delay: -0.3,
        })
        .to(well.current!, {
          height:
            window.innerHeight -
            wrapper.current?.getBoundingClientRect().top! -
            30,
          duration: 0.4,
          delay: -0.3,
        });

      shiftToPaneTimeline.current.then(() => {
        panes[pane].current!.show();
      });
    }

    if (pane === 'main') {
      shiftToPaneTimeline.current?.reverse();

      if (prevPane.current && prevPane.current !== 'main') {
        panes[prevPane.current].current!.hide();
      }
    }

    prevPane.current = pane;
  }, [pane, wrapper]);

  return {
    refs: {
      well,
      toolbar,
      panes,
    },
  };
}

export function usePopFromLeft() {
  const wrapper = useRef<HTMLDivElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const { isRtl } = useCurrentLanguage();

  const directionMultiplier = isRtl ? -1 : 1;

  const getX = useCallback(() => {
    return (
      (20 - (wrapper.current?.getBoundingClientRect().left ?? 0)) *
      directionMultiplier
    );
  }, [directionMultiplier]);

  useEffect(() => {
    if (wrapper.current && toolbar.current) {
      gsap.timeline().fromTo(
        toolbar.current,
        {
          x:
            (-100 - wrapper.current.getBoundingClientRect().left) *
            directionMultiplier,
          scaleX: 0.6,
        },
        {
          x: getX(),
          scaleX: 1,
          // delay: 3,
          duration: 0.3,
          ease: 'back.out(3)',
        },
      );
    }
  }, [wrapper.current, toolbar.current, isRtl]);

  useEffect(() => {
    function handleResize() {
      if (toolbar.current) {
        toolbar.current.style.transform = `translateX(${getX()}px)`;
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getX]);

  return [wrapper, toolbar];
}

export function useTransitionPane(ref: any) {
  const wrapper = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    show: () => {
      const elements = [...wrapper.current!.querySelectorAll('*:not(:empty)')];
      wrapper.current!.style.opacity = '1';
      wrapper.current!.style.pointerEvents = 'all';
      gsap.fromTo(
        wrapper.current!,
        { y: window.innerHeight },
        { y: 0, duration: 0.5 },
      );
      gsap.fromTo(
        elements,
        {
          opacity: 0,
          scale: 0.7,
        },
        {
          opacity: 1,
          scale: 1,
          ease: 'back.out(1.3)',
          duration: 0.3,
          stagger: elements.length > 15 ? 0.025 : 0.05,
        },
      );
    },
    hide: () => {
      wrapper.current!.style.pointerEvents = 'none';
      gsap.to(wrapper.current!, { y: window.innerHeight, duration: 0.5 });
    },
  }));

  return wrapper;
}
