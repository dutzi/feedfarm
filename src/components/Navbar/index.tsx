import React, { useEffect, useState, useLayoutEffect } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { Link, useLocation } from 'react-router-dom';
import UserAvatar from '../UserAvatar';
import firebase from 'firebase/app';
import useCurrentUser from '../../hooks/use-current-user';
import useImpersonatedUser from '../../hooks/use-impersonated-user';
import useRerenderOnResize from '../../hooks/use-rerender-on-resize';
import useIsCurrentUserPremium from '../../hooks/use-is-current-user-premium';
import useIsMobile from '../../hooks/use-is-mobile';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import UserPhoto from '../UserPhoto';

function useHasUnreadMessages(interval: number) {
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // function getHasUnreadMessage() {
  //   const hasUnreadMessages = firebase
  //     .functions()
  //     .httpsCallable('hasUnreadMessages');

  //   hasUnreadMessages()
  //     .then(res => {
  //       setHasUnreadMessages(res.data.hasUnreadMessages);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }

  // useEffect(() => {
  //   getHasUnreadMessage();
  // }, []);

  useEffect(() => {
    // const intervalId = setInterval(getHasUnreadMessage, interval);
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [interval]);

  return hasUnreadMessages;
}

function useHasNotifications() {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [currentUser] = useCurrentUser();

  useEffect(() => {
    if (currentUser) {
      // setHasNotifications(
      //   !!currentUser.notifications?.find(notification => !notification.read),
      // );
    }
  }, [currentUser]);

  return hasNotifications;
}

export default function Navbar() {
  const hasUnreadMessages = useHasUnreadMessages(10000);
  const hasNotifications = useHasNotifications();
  const [currentUser] = useCurrentUser();
  const impersonatedUser = useImpersonatedUser();
  const isCurrentUserPremium = useIsCurrentUserPremium();
  useRerenderOnResize();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [showMenuOnMobile, setShowMenuOnMobile] = useState(false);

  const location = useLocation();
  const pages = [
    { route: '/my-feeds', label: t('navbar.feeds', 'My Feeds') },
    { route: '/create-feed', label: t('navbar.createFeed', 'Create A Feed') },
    // { route: '/liked', label: t('navbar.likes', 'Liked Posts') },
    // { route: '/saved', label: t('navbar.saved', 'Saved Posts') },
    // { route: '/find-matches', label: t('navbar.findMatches', 'Find Matches') },
    // { route: '/my-tags', label: t('navbar.myTags', 'My Tags') },
    // { route: '/videos-swipe', label: t('navbar.videosSwipe', 'Video Swipe') },
  ];

  if (currentUser?.isGuest) {
    pages.push({
      route: '/signup',
      label: t('navbar.signup', 'Signup'),
    });
  }

  function renderProfileButton() {
    if (currentUser) {
      return (
        <div className={styles.userMenu}>
          <Link
            to="/edit-profile"
            className={cx(styles.rightSideButton, styles.rounded)}
          >
            <UserPhoto photo={currentUser.userPhoto} size="sm" />
            {isCurrentUserPremium && (
              <div className={styles.premiumBadge}>
                <i className="fa fa-crown" />
              </div>
            )}
          </Link>
          {!isMobile && (
            <div className={styles.username}>
              {(impersonatedUser || currentUser).username}
            </div>
          )}
          {/* <i className="fa fa-chevron-down" /> */}
        </div>
      );
    }
  }

  function renderNotificationButtons() {
    return null;

    // const isInMessages = location.pathname === '/messages';
    // const isInNotifications = location.pathname === '/notifications';

    // return (
    //   <>
    //     <Link
    //       to="/messages"
    //       className={cx(
    //         styles.rightSideButton,
    //         isInMessages && styles.active,
    //         hasUnreadMessages && styles.showBadge,
    //       )}
    //     >
    //       <i className="fa fa-comment-alt" />
    //     </Link>
    //     <Link
    //       to="/notifications"
    //       className={cx(
    //         styles.rightSideButton,
    //         isInNotifications && styles.active,
    //         hasNotifications && styles.showBadge,
    //       )}
    //     >
    //       <i className="fa fa-bell" />
    //     </Link>
    //   </>
    // );
  }

  function renderDesktopNavbar() {
    if (isMobile && !showMenuOnMobile) {
      return null;
    }

    const pagesForDevice = isMobile
      ? [
          ...pages,
          ...[
            {
              route: '/messages',
              label: t('Messages'),
              showBadge: hasUnreadMessages,
            },
            {
              route: '/notifications',
              label: t('Notifications'),
              showBadge: hasNotifications,
            },
          ],
        ]
      : pages;

    return (
      <nav className={styles.nav}>
        <ul>
          {pagesForDevice.map(page => (
            <li
              key={page.route}
              className={cx(
                styles.navItem,
                location.pathname === page.route && styles.selected,
              )}
            >
              <Link onClick={closeMenuOnMobile} to={page.route}>
                {page.label}
              </Link>
              {'showBadge' in page && page.showBadge && (
                <div className={styles.navItemBadge} />
              )}
            </li>
          ))}
        </ul>
        <div className={styles.rightSideButtons}>
          {!isMobile && renderNotificationButtons()}
          {!isMobile && renderProfileButton()}
          {isMobile && (
            <button className={styles.closeButton} onClick={closeMenuOnMobile}>
              ×
            </button>
          )}
        </div>
      </nav>
    );
  }

  function handleMobileMenuClick() {
    setShowMenuOnMobile(!showMenuOnMobile);
  }

  function closeMenuOnMobile() {
    setShowMenuOnMobile(false);
  }

  function renderMobileMenu() {
    return (
      <div className={styles.mobileNav}>
        <div className={styles.buttonWrapper}>
          <button className={styles.menuButton} onClick={handleMobileMenuClick}>
            <i className="fa fa-bars" />
          </button>
          {(hasUnreadMessages || hasUnreadMessages) && (
            <div className={styles.badge}></div>
          )}
        </div>
        {renderProfileButton()}
        {renderDesktopNavbar()}
        {showMenuOnMobile && (
          <div className={styles.backdrop} onClick={closeMenuOnMobile} />
        )}
      </div>
    );
  }

  if (location.pathname === '/' && (!currentUser || currentUser?.isGuest)) {
    return null;
  }

  if (isMobile) {
    return renderMobileMenu();
  } else {
    return renderDesktopNavbar();
  }
}
