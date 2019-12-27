import { useEffect } from 'react';
import { useAnimationRef } from '../../utils';

export function useAnimate(show: boolean) {
  const ref = useAnimationRef();

  // useEffect(() => {
  //   if (ref.current && show) {
  //     gsap
  //       .timeline()
  //       .fromTo(
  //         ref.current.querySelectorAll('button'),
  //         {
  //           filter: 'brightness(0)',
  //           opacity: 0.4,
  //           boxShadow: '0px 0px #0000006b',
  //           x: 3,
  //           y: 3,
  //         },
  //         {
  //           opacity: 1,
  //           filter: 'brightness(1)',
  //           duration: 0.5,
  //           stagger: 0.25,
  //         },
  //       )
  //       .to(ref.current.querySelectorAll('button'), {
  //         boxShadow: '3px 3px #0000006b',
  //         x: 0,
  //         y: 0,
  //         duration: 0.5,
  //         stagger: 0.25,
  //       });
  //   }
  // }, [ref, show]);

  return { refs: { rating: ref } };
}
