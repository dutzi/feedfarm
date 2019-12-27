import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';
import cx from 'classnames';
import useSendMessageButton from '../../hooks/use-send-message-button';
import { ADMIN_UID } from '../../utils';
import { Link } from 'react-router-dom';
import useCurrentUser from '../../hooks/use-current-user';
import { useTranslation, Trans } from 'react-i18next';
import useCurrentLanguage from '../../hooks/use-current-language';
import useContentSizer from '../../hooks/use-content-sizer';
import gsap from 'gsap';

export default function Footer(
  { layout }: { layout?: 'sidebar' | 'footer' } = { layout: 'footer' },
) {
  const [currentUser] = useCurrentUser();
  const { t } = useTranslation();
  const {
    prettyLanguage,
    showLanguageSelector,
    renderLanguageSelector,
  } = useCurrentLanguage();
  const wrapper = useRef<HTMLDivElement>(null);

  const [, , footerRef] = useContentSizer();

  const [renderSendMessageButton, renderModal] = useSendMessageButton(
    {
      id: ADMIN_UID,
      photos: [''],
      username: 'dutzi',
      bio: '',
    },
    onClick => {
      function handleContactUs(e: React.MouseEvent) {
        e.preventDefault();
        onClick();
      }

      return (
        <a href="#/contact-us" onClick={handleContactUs}>
          {t('Contact Us')}
        </a>
      );
    },
  );
  useEffect(() => {
    if (wrapper.current && layout === 'sidebar') {
      gsap.fromTo(
        wrapper.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1,
        },
      );
    }
  }, [wrapper.current]);

  function renderMailToButton() {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="mailto:support@feed.farm"
      >
        {t('Contact Us')}
      </a>
    );
  }

  function handleShowLanguageSelector(e: React.MouseEvent) {
    e.preventDefault();
    showLanguageSelector();
  }

  return (
    <footer
      ref={footerRef}
      className={cx(styles.wrapper, layout === 'sidebar' && styles.sidebar)}
    >
      <div ref={wrapper} className={styles.content}>
        <ul>
          <li>
            <a href="#/set-language" onClick={handleShowLanguageSelector}>
              <i className="fa fa-flag" />
              <div className="margin-v-sm" />
              {prettyLanguage}
            </a>
          </li>
          <li>·</li>
          <li>
            <Link to="/terms-and-conditions">{t('Terms and Conditions')}</Link>
          </li>
          <li>·</li>
          <li>
            <Link to="/cookie-policy">{t('Cookie Policy')}</Link>
          </li>
          <li>·</li>
          <li>
            {/* {currentUser ? renderSendMessageButton() : renderMailToButton()} */}
            {renderMailToButton()}
          </li>
        </ul>
        <div className={styles.credits}>
          <Trans i18nKey="footer.loveYou">
            Made with <i className="fa fa-heart"></i> by dutzi
          </Trans>
        </div>
      </div>
      {renderModal({
        placeholder: t(
          'footer.messagePlaceholder',
          'Got a question? Or maybe a feature request? 🙂',
        ),
      })}
      {renderLanguageSelector()}
    </footer>
  );
}
