import React from 'react';
import styles from './index.module.scss';
import Label from '../Label';
import { useTranslation } from 'react-i18next';

export default function LabelledTextarea({
  id,
  label,
  value,
  autoFocus,
  onChange,
  onValueChange,
  maxLength,
  testId,
}: {
  id: string;
  label: string;
  value?: any;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: any) => void;
  maxLength?: number;
  testId?: string;
}) {
  const { t } = useTranslation();

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Label id={id}>{label}</Label>
      <textarea
        className={styles.textarea}
        onChange={handleChange}
        id={id}
        data-test-id={testId}
        autoFocus={autoFocus}
        value={value}
        placeholder={t('Tell us a bit about yourself...')}
        maxLength={maxLength}
      />
    </div>
  );
}
