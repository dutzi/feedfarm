import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Input from '../Input';
import Label from '../Label';

export default function LabelledInput({
  id,
  label,
  value,
  type,
  autoFocus,
  onChange,
  onValueChange,
  trimValue,
  disabled,
  maxLength,
  testId,
  autoComplete,
  fullWidth,
  variant = 'default',
  placeholder,
}: {
  id: string;
  label: string;
  value?: any;
  type?: string;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: any) => void;
  trimValue?: boolean;
  disabled?: boolean;
  maxLength?: number;
  testId?: string;
  autoComplete?: string;
  fullWidth?: boolean;
  variant?: 'default' | 'owner-tools';
  placeholder?: string;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(trimValue ? e.target.value.trim() : e.target.value);
    }
  }

  return (
    <div className={cx(styles.wrapper, styles[`variant-${variant}`])}>
      <Label id={id}>{label}</Label>
      <Input
        onChange={handleChange}
        id={id}
        type={type}
        autoFocus={autoFocus}
        size="lg"
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        testId={testId}
        autoComplete={autoComplete}
        fullWidth={fullWidth}
        variant={variant}
        placeholder={placeholder}
      />
    </div>
  );
}
