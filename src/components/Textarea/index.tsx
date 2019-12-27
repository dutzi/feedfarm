import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { isRTLChar } from '../../utils';
import { useTranslation } from 'react-i18next';
import usePopAlert from '../../hooks/use-pop-alert';

function Textarea(
  {
    id,
    value,
    autoFocus,
    onChange,
    onValueChange,
    maxLength,
    testId,
    placeholder,
    resize,
    disabled,
  }: {
    id: string;
    value?: any;
    autoFocus?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onValueChange?: (value: any) => void;
    maxLength?: number;
    testId?: string;
    placeholder?: string;
    resize: 'none' | 'vertical' | 'horizontal';
    disabled?: boolean;
  },
  ref: any,
) {
  const popAlert = usePopAlert();

  useImperativeHandle(ref, () => ({
    popAlert: popAlert.pop,
    hideAlert: popAlert.hide,
  }));

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    popAlert.hide();

    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  }

  return (
    <div
      className={cx(styles.wrapper, styles[`resize-${resize}`])}
      ref={popAlert.ref}
    >
      <textarea
        className={styles.textarea}
        onChange={handleChange}
        id={id}
        data-test-id={testId}
        autoFocus={autoFocus}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

export default forwardRef(Textarea);
