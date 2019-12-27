import React, { useState } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';

export default ({
  value,
  options,
  onValueChange,
  fullWidth = false,
  variant = 'default',
}) => {
  const [focused, setFocused] = useState(false);
  const selectedOption = options.find(option => option.value === value) || {};

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    setFocused(false);
  }

  function handleChange(e) {
    onValueChange(e.target.value);
  }

  return (
    <div
      className={cx(
        styles.wrapper,
        styles[`variant-${variant}`],
        focused && styles.focused,
        fullWidth && styles.fullWidth,
      )}
    >
      <div className={styles.selectedOptionLabel}>{selectedOption.label}</div>
      <i className="fa fa-caret-down" />
      <select
        className={styles.actualSelect}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      >
        {options.map(option => (
          <option
            key={option.value}
            value={option.value}
            label={option.label}
          ></option>
        ))}
      </select>
    </div>
  );
};
