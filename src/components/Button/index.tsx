import React, { useRef } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Spinner from 'react-spinner-material';
import { Link } from 'react-router-dom';
import useMaintainRatio from '../../hooks/use-maintain-ratio';
import useIsMobile from '../../hooks/use-is-mobile';
import { useTranslation } from 'react-i18next';

export default function Button({
  label,
  href,
  size = 'md',
  variant = 'primary',
  icon,
  onClick,
  fullWidth,
  showSpinner,
  highlightIcon,
  alignStart,
  disabled,
  rounded,
  minimizeOnMobile,
  testId,
  showNewBadge,
  isUploadFile,
  onChange,
  svgIcon,
}: {
  label?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'ghost-muted';
  icon?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  showSpinner?: boolean;
  highlightIcon?: boolean;
  alignStart?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  minimizeOnMobile?: boolean;
  testId?: string;
  showNewBadge?: boolean;
  isUploadFile?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  svgIcon?: JSX.Element;
}) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const className = cx(styles.wrapper, {
    [styles.sizeSm]: size === 'sm',
    [styles.sizeMd]: size === 'md',
    [styles.sizeLg]: size === 'lg',
    [styles.colorPrimary]: variant === 'primary',
    [styles.colorSecondary]: variant === 'secondary',
    [styles.colorGhost]: variant === 'ghost',
    [styles.colorLink]: variant === 'link',
    [styles.colorGhostMuted]: variant === 'ghost-muted',
    [styles.fullWidth]: fullWidth,
    [styles.noLabel]: !label,
    [styles.showSpinner]: showSpinner,
    [styles.highlightIcon]: highlightIcon,
    [styles.alignStart]: alignStart,
    [styles.disabled]: disabled,
    [styles.rounded]: rounded,
    [styles.minimizeOnMobile]: minimizeOnMobile,
  });

  const ref = useMaintainRatio<HTMLButtonElement>(1, {
    active: (!label || (isMobile && !!minimizeOnMobile)) && !!icon,
    change: 'height',
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  function handleClick(e: React.MouseEvent) {
    if (disabled) {
      return;
    }

    if (!isUploadFile) {
      e.preventDefault();
    }

    if (inputFileRef.current && e.target !== inputFileRef.current) {
      inputFileRef.current.click();
    }

    if (onClick) {
      onClick();
    }
  }

  function handleLinkClick(e: React.MouseEvent) {
    if (href?.startsWith('#')) {
      e.preventDefault();
    }

    onClick && onClick();
  }

  if (href) {
    return (
      <Link
        data-test-id={testId}
        onClick={handleLinkClick}
        to={href}
        className={className}
      >
        {icon && <i className={icon} />}
        <span className={styles.label}>{label}</span>
        {showSpinner && (
          <div className={styles.spinnerWrapper}>
            <Spinner spinnerColor="white" spinnerWidth={3} size={20} visible />
          </div>
        )}
      </Link>
    );
  } else {
    return (
      <button
        ref={ref}
        data-test-id={testId}
        onClick={handleClick}
        className={className}
        disabled={disabled}
      >
        {icon && <i className={icon} />}
        {svgIcon}
        <span className={styles.label}>{label}</span>
        {showSpinner && (
          <div className={styles.spinnerWrapper}>
            <Spinner spinnerColor="white" spinnerWidth={3} size={20} visible />
          </div>
        )}
        {label && showNewBadge && (
          <div
            className={styles.newBadge}
            aria-label="New Premium Feature!"
            data-balloon-pos="up"
          >
            {t('New')}
          </div>
        )}
        {!label && showNewBadge && (
          <div className={styles.newBadgeTiny}>{t('New')}</div>
        )}
        {isUploadFile && (
          <input
            ref={inputFileRef}
            type="file"
            className={styles.uploadFileButton}
            onChange={onChange}
          />
        )}
      </button>
    );
  }
}
