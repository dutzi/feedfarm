import { IState } from '../state/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import useIsMobile from './use-is-mobile';

export default function usePopAlert() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transition =
        'box-shadow 1s cubic-bezier(0.32, 1.04, 0.35, 2.86)';
    }
  }, [ref.current]);

  function pop() {
    ref.current!.style.boxShadow = '0px 0px 0px 0px #F44336';
    setTimeout(() => {
      ref.current!.style.boxShadow = '0px 0px 0px 3px #F44336';
    }, 100);
  }

  function hide() {
    ref.current!.style.boxShadow = '';
  }

  return { pop, ref, hide };
}
