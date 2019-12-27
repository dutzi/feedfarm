import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import useIsMobile from './use-is-mobile';

export default function useAnimateElements(selector: string) {
  const wrapper = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (wrapper.current && !isMobile) {
      wrapper.current.style.opacity = '1';
      [...wrapper.current.querySelectorAll(selector)].forEach(
        (element, index) => {
          if (element.getAttribute('data-animated')) return;

          gsap.to(element, { scale: 0.3, y: 20, opacity: 0, duration: 0 });
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            scale: 1,
            delay: index * 0.03,
            ease: 'back.out(1.2)',
          });
          element.setAttribute('data-animated', 'true');
        },
      );
    }
  }, [wrapper, isMobile, selector]);

  return wrapper;
}
