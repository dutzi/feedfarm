import { IState } from '../state/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import useIsMobile from './use-is-mobile';

export default function useContentSizer({
  setHeight,
}: { setHeight?: boolean } = {}): [
  React.RefObject<HTMLDivElement>,
  React.RefObject<HTMLDivElement>,
  React.RefObject<HTMLDivElement>,
] {
  const dispatch = useDispatch();
  const footerEl = useSelector((state: IState) => state.ui.footerEl);
  const headerEl = useSelector((state: IState) => state.ui.headerEl);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (headerRef.current) {
      dispatch({
        type: 'set-header-el',
        payload: { headerEl: headerRef.current },
      });
    }
  }, [headerRef.current]);

  useEffect(() => {
    if (footerRef.current) {
      dispatch({
        type: 'set-footer-el',
        payload: { footerEl: footerRef.current },
      });
    }
  }, [footerRef.current]);

  useEffect(() => {
    function handleResize() {
      if (!isMobile && headerEl && footerEl && wrapperRef.current) {
        const height =
          window.innerHeight -
          footerEl.getBoundingClientRect().height -
          headerEl.getBoundingClientRect().bottom +
          'px';

        if (setHeight) {
          wrapperRef.current.style.height = height;
        } else {
          wrapperRef.current.style.minHeight = height;
        }
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [headerEl, footerEl, wrapperRef.current, isMobile]);

  return [wrapperRef, headerRef, footerRef];
}
