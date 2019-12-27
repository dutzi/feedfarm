import React from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Spinner from 'react-spinner-material';

export default function SubmitButton({
  onClick,
  label,
  showSpinner,
  disabled,
  testId,
}: {
  onClick: () => void;
  label: string;
  showSpinner?: boolean;
  disabled?: boolean;
  testId?: string;
}) {
  function handleClick(e: React.FormEvent) {
    e.preventDefault();
    onClick();
  }

  return (
    <div className={cx(styles.wrapper, showSpinner && styles.isDisabled)}>
      {showSpinner && (
        <div className={styles.spinner}>
          <Spinner
            size={20}
            spinnerWidth={2}
            spinnerColor="var(--feedfarm-cyan)"
            visible
          />
        </div>
      )}
      <input
        onClick={handleClick}
        className={cx(styles.button, disabled && styles.disabled)}
        type="submit"
        data-test-id={testId}
        value={label}
        disabled={showSpinner || disabled}
      ></input>
    </div>
  );
}
