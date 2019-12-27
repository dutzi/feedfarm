import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './index.module.scss';
import { Trans } from 'react-i18next';

export default function CookiePopover() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('respondedToCookiePopover') === null) {
      setShow(true);
    }
  }, []);

  function handleClose() {
    window.localStorage.setItem('respondedToCookiePopover', 'true');
    setShow(false);
  }

  if (!show) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Trans i18nKey="cookieDisclaimer">
        We use cookies to ensure that we give you the best experience on our
        website. To learn more, click <Link to="/cookie-policy">here</Link>.
      </Trans>
      <button onClick={handleClose} className={styles.closeButton}>
        ×
      </button>
    </div>
  );
}
