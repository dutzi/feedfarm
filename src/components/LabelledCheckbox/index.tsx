import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';

export default function LAbelledCheckbox({
  id,
  label,
  value,
  onValueChange,
  dark,
}: {
  id: string;
  label: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  dark?: boolean;
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onValueChange) {
      onValueChange(e.target.checked);
    }
  }

  return (
    <div className={cx(styles.wrapper, dark && styles.dark)}>
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={value}
        onChange={handleChange}
      />
      <label htmlFor={id}>
        <i className={cx(styles.checkmark, 'fa fa-check')} />
        {label}
      </label>
    </div>
  );
}
