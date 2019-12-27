import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import firebase from 'firebase/app';
import cx from 'classnames';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import useIsSFWMode from '../../hooks/use-is-sfw-mode';
import { ReactComponent as FeedFarmLogo } from '../Icons/feedfarm-logo.svg';
import { ReactComponent as FeedFarmLogoShadow } from '../Icons/feedfarm-logo-shadow.svg';
import { Link, useLocation } from 'react-router-dom';
import useKeyboardShortcut from '../../hooks/use-keyboard-shortcut';
import { updateCurrentUser } from '../../state/actions';
import { useTranslation } from 'react-i18next';
import useCurrentLanguage from '../../hooks/use-current-language';
import useContentSizer from '../../hooks/use-content-sizer';
import useIsCurrentUserAdmin from '../../hooks/use-is-current-user-admin';
import useCurrentUser from '../../hooks/use-current-user';
// import gsap from 'gsap';

const WIDTH = 40;

interface IStats {
  numUsers: number;
  lastUsername: string;
  numChatMessages: number;
}

function useAnimation() {
  const wrapper = useRef<HTMLDivElement>(null);
  const stripeRefs: React.RefObject<HTMLDivElement>[] = [];

  for (var i = 0; i < window.innerWidth / WIDTH; i++) {
    const stripeRef = React.createRef<HTMLDivElement>();
    stripeRefs.push(stripeRef);
  }

  useEffect(() => {
    if (wrapper.current) {
      [...wrapper.current.querySelectorAll('div')].forEach((stripe, index) => {
        setTimeout(() => {
          stripe.style.top = '0px';
        }, index * 33 + 1000);

        setTimeout(() => {
          stripe.style.opacity = '0';
        }, index * 33 + 1500);
      });
    }
  }, [wrapper]);

  function getStripeStyle(index: number) {
    return {
      left: index * WIDTH + 'px',
      width: WIDTH + 'px',
    };
  }

  return (
    <div ref={wrapper} className={styles.stripesWrapper}>
      {stripeRefs.map((ref, index) => (
        <div
          className={styles.stripe}
          ref={ref}
          style={getStripeStyle(index)}
        />
      ))}
    </div>
  );
}

export default () => {
  const isSFWMode = useIsSFWMode();
  const { isRtl } = useCurrentLanguage();
  const { t } = useTranslation();
  const [, headerRef] = useContentSizer();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const [stats, setStats] = useState<IStats>();
  const [currentUser] = useCurrentUser();
  const location = useLocation();
  // const stripes = useAnimation();

  useEffect(() => {
    if (isCurrentUserAdmin) {
      firebase
        .firestore()
        .doc('/stats/site')
        .onSnapshot(stats => {
          setStats(stats.data() as IStats);
        });
    }
  }, [isCurrentUserAdmin]);

  function handleToggleSFWMode() {
    // dispatch(updateCurrentUser({ isSFWMode: !isSFWMode }));
  }

  const isNoNavbar =
    location.pathname === '/' && (!currentUser || currentUser?.isGuest);

  return (
    <header
      ref={headerRef}
      className={cx(styles.wrapper, isNoNavbar && styles.noNavbar)}
    >
      <div className={styles.content}>
        <div className={styles.spacedFlexRow}>
          <Link className={styles.link} to="/">
            <div className={cx(styles.logo, isSFWMode && styles.sfwMode)}>
              <FeedFarmLogoShadow />
              {/* <img src={!isSFWMode ? '/logo-new.png' : '/logo-sfw-new.png'} /> */}
            </div>
            {/* <div className={styles.slogan}>
              <div>{content.slogan1}</div>
              <div>{content.slogan2}</div>
            </div> */}
          </Link>
          {isCurrentUserAdmin && stats && (
            <div className={styles.stats}>
              <span className={styles.adminToolsLink}>
                <Link to="/admin-tools">Admin Tools</Link>
              </span>
              <div className={styles.stat}># Users </div>
              <strong>{stats.numUsers}</strong>
              <div className={styles.stat}># Messages</div>
              <strong>{stats.numChatMessages}</strong>
              <div className={styles.stat}>Last User</div>
              <strong>{stats.lastUsername}</strong>
            </div>
          )}
          {/* {stripes} */}
        </div>
      </div>
    </header>
  );
};
