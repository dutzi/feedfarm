import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
} from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { isRTLChar } from '../../utils';
import { useTranslation } from 'react-i18next';
import usePopAlert from '../../hooks/use-pop-alert';

function Input(
  {
    id,
    type = 'input',
    value,
    autoFocus,
    size = 'md',
    onFocus,
    onBlur,
    fullWidth,
    placeholder,
    onChange,
    onValueChange,
    onSubmit,
    onCancel,
    disabled,
    maxLength,
    testId,
    readOnly,
    autoComplete,
    copyButton,
    variant = 'default',
  }: {
    id?: string;
    type?: string;
    value?: any;
    autoFocus?: boolean;
    size?: 'sm' | 'md' | 'lg';
    onFocus?: () => void;
    onBlur?: () => void;
    fullWidth?: boolean;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onValueChange?: (value: string) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    disabled?: boolean;
    maxLength?: number;
    testId?: string;
    readOnly?: boolean;
    autoComplete?: string;
    copyButton?: boolean;
    variant?: 'default' | 'owner-tools';
  },
  ref: any,
) {
  const inputRef = React.createRef<HTMLInputElement>();
  const [isRTL, setIsRTL] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation();
  const popAlert = usePopAlert();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current && inputRef.current.focus();
    },
    popAlert: popAlert.pop,
    hideAlert: popAlert.hide,
  }));

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, inputRef.current]);

  useEffect(() => {
    if (autoFocus && copyButton && inputRef.current) {
      inputRef.current.setSelectionRange(0, value.length);
    }
  }, [copyButton, inputRef.current]);

  const className = cx(styles.input, styles[`variant-${variant}`], {
    [styles.sm]: size === 'sm',
    [styles.md]: size === 'md',
    [styles.lg]: size === 'lg',
    [styles.fullWidth]: fullWidth,
    [styles.disabled]: disabled,
    [styles.rtl]: isRTL,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    popAlert.hide();

    const value = e.target.value;

    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(value);
    }

    const _isRTL = isRTLChar(value[0]);
    if (_isRTL !== isRTL) {
      setIsRTL(_isRTL);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode === 13 && onSubmit) {
      onSubmit();
    }

    if (e.keyCode === 27 && onCancel) {
      onCancel();
    }
  }

  function handleCopy() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }

  const input = (
    <div ref={popAlert.ref} className={styles.inputWrapper}>
      <input
        ref={inputRef}
        className={className}
        id={id}
        data-test-id={testId}
        type={type}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        maxLength={maxLength}
        readOnly={readOnly}
        autoComplete={autoComplete}
      />
    </div>
  );

  if (copyButton) {
    return (
      <div className={styles.wrapper}>
        {input}
        <button className={styles.copyButton} onClick={handleCopy}>
          {isCopied ? t('Copied!') : t('Copy')}
        </button>
      </div>
    );
  } else {
    return input;
  }
}

export default forwardRef(Input);
