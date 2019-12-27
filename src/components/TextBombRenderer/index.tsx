import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { TTextBombStyle } from '@feedfarm-shared/types';
import cx from 'classnames';
import SplitText from 'gsap/SplitText';
import * as animators from './animtators';

export default function TextBombRenderer({
  text,
  animationStyle,
  inline,
  delay = 0,
  onDone,
}: {
  text: string;
  animationStyle: TTextBombStyle;
  inline?: boolean;
  delay?: number;
  onDone?: () => void;
}) {
  const timeout = useRef<NodeJS.Timeout>();
  const textRef = useRef<HTMLDivElement>(null);

  function animate() {
    if (textRef.current) {
      const mySplitText = new SplitText(textRef.current!, { type: 'words' });
      mySplitText.split({ type: 'chars, words' });
      textRef.current!.style.color = 'inherit';

      animators[animationStyle](mySplitText).then(onDone);
    }
  }

  useEffect(() => {
    textRef.current!.innerHTML = '';
    textRef.current!.innerText = text;
    textRef.current!.style.color = 'transparent';
    clearTimeout(timeout.current!);

    timeout.current = setTimeout(() => {
      animate();
    }, 300 + delay);
  }, [text, animationStyle]);

  return (
    <div className={cx(styles.wrapper, inline && styles.inline)} ref={textRef}>
      {text || '⠀'}
    </div>
  );
}
