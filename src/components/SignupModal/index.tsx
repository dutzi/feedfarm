import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import Modal from '../Modal';
import Signup from '../../pages/Signup';
// import useMeasure from 'react-use-measure';
import { Trans } from 'react-i18next';
import gsap from 'gsap';
import mergeRefs from 'typed-merge-refs';

function Animation({
  children,
  modalRef,
  backdropRef,
}: {
  children: JSX.Element[];
  modalRef: React.RefObject<HTMLDivElement>;
  backdropRef: React.RefObject<HTMLDivElement>;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const childRefs: React.RefObject<HTMLDivElement>[] = [];
  const [dimensions, setDimensions] = useState<DOMRect[]>([]);
  const [index, setIndex] = useState(-1);
  // const [measureRef, bounds] = useMeasure();
  const [wrapperBounds, setWrapperBounds] = useState<DOMRect>();
  const [animateOut, setAnimateOut] = useState(false);

  children.forEach((child, index) => {
    childRefs[index] = React.createRef();
  });

  useEffect(() => {
    if (animateOut) {
      gsap.to(childRefs[0].current!, {
        opacity: 0,
        y: -100,
        duration: 0.5,
        scale: 1,
        ease: 'back.in(1.7)',
        onComplete: () => {
          setAnimateOut(false);
          setIndex(index + 1);
        },
      });
    }
  }, [animateOut]);

  useEffect(() => {
    if (index > -1) {
      if (index === 0) {
        setTimeout(() => {
          setAnimateOut(true);
        }, 2000);
      }
      if (wrapper.current) {
        let delay: number;
        let wrapperDuration: number;

        if (index > 0) {
          wrapperDuration = 0.5;
          delay = 0;
        } else {
          wrapperDuration = 0;
          delay = 0;
        }

        gsap.to(wrapper.current, {
          height: dimensions[index].height,
          duration: wrapperDuration,
          ease: 'back.out(1.7)',
          delay,
        });

        gsap.to(modalRef.current!, {
          y: window.innerHeight / 2 - dimensions[index].height / 2 - 150,
          duration: wrapperDuration,
          ease: 'back.out(1.7)',
          delay,
        });

        gsap.fromTo(
          childRefs[index].current!,
          {
            y: 100,
            scale: index === 0 ? 1.5 : 1,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            scale: 1,
            ease: 'back.out(1.7)',
            delay,
          },
        );
      }
    }
  }, [index]);

  useEffect(() => {
    if (dimensions.length) {
      return;
    }

    const _dimensions: DOMRect[] = [];
    childRefs.forEach(ref => {
      if (ref.current) {
        _dimensions.push(ref.current.getBoundingClientRect());
      }
    });

    setWrapperBounds(modalRef.current!.getBoundingClientRect());
    setDimensions(_dimensions);
    animateModal();
    setIndex(index + 1);
  }, [childRefs[0] && childRefs[0].current, dimensions]);

  function animateModal() {
    gsap.fromTo(
      modalRef.current!,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
    );

    gsap.fromTo(
      backdropRef.current!,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
    );
  }

  const childStyle: React.CSSProperties = {};

  if (wrapperBounds) {
    childStyle.width = wrapperBounds.width - 48 + 'px';
  }

  return (
    <div
      ref={mergeRefs(/*measureRef, */ wrapper)}
      className={cx(dimensions.length && styles.hasDimensions)}
    >
      {children.map((child, childIndex) => {
        if (index !== -1 && childIndex !== index) {
          return null;
        }

        return (
          <div
            className={styles.childWrapper}
            ref={childRefs[childIndex]}
            style={childStyle}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}

function useAnimation() {
  const message = useRef<HTMLDivElement>(null);
  const signup = useRef<HTMLDivElement>(null);
  const [hasInitializedHeight, setHasInitializedHeight] = useState(false);

  function start() {}

  useEffect(() => {
    if (signup.current && message.current && !hasInitializedHeight) {
      setHasInitializedHeight(true);
      message.current.style.height =
        signup.current.getBoundingClientRect().height + 'px';
      signup.current.style.display = 'none';
    }
  }, [signup.current, message.current, hasInitializedHeight]);

  return {
    animation: {
      start,
      refs: {
        message,
        signup,
      },
    },
    Animation,
  };
}

export default function SignupModal({ show }: { show: boolean }) {
  const dispatch = useDispatch();
  const { animation, Animation } = useAnimation();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  function handleClose() {
    dispatch({ type: 'close-signup-modal' });
  }

  useEffect(() => {
    if (show) {
      animation.start();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onClose={handleClose}
      ref={modalRef}
      backdropRef={backdropRef}
      controlledAnimation
    >
      <div className={styles.wrapper}>
        <Animation modalRef={modalRef} backdropRef={backdropRef}>
          <div className={styles.message}>
            <Trans i18nKey="signup.preMessage">
              Please create an anonymous account before proceeding
            </Trans>
          </div>
          <div className={styles.wrapper}>
            <Signup />
          </div>
        </Animation>
      </div>
    </Modal>
  );
}
