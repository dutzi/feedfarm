import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import { useDispatch, useSelector } from 'react-redux';
import { TSupportedLanguages } from '@feedfarm-shared/types';
import Modal from '../components/Modal';
import * as I18n from '../i18n';
import styles from './index.module.scss';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import { updateCurrentUser } from '../state/actions';
import useCurrentUser from './use-current-user';
import { IState } from '../state/reducer';
import { requestLanguage } from '../firebase-functions';

type TLanguage = {
  code: TSupportedLanguages;
  label: string;
  supported: boolean;
};

function getLanguageCodeFromNavigator() {
  if (navigator.language === 'he') {
    return 'he';
  } else {
    return 'en';
  }
}

const rtlLangugages: TSupportedLanguages[] = ['he', 'ar'];

export default function useCurrentLanguage() {
  const [currentUser] = useCurrentUser();
  const dispatch = useDispatch();
  const [prettyLanguage, setPrettyLanguage] = useState('English');
  const [isShowLanguageSelector, setIsShowLanguageSelector] = useState(false);
  const [fallbackLanguage, setFallbackLanguage] = useState<
    TSupportedLanguages
  >();
  const { t } = useTranslation();
  const [showComingSoon, setShowComingSoon] = useState<TLanguage | null>(null);

  const currentUserLanguage = currentUser && currentUser.language;
  const localStorageLanguage = window.localStorage.getItem(
    'language',
  ) as TSupportedLanguages;
  const storeLanguage = useSelector((state: IState) => state.ui.language);

  const language =
    storeLanguage ||
    currentUserLanguage ||
    fallbackLanguage ||
    localStorageLanguage;

  // (window.localStorage.getItem('language') as TSupportedLanguages) ||
  // new URLSearchParams(window.location.search).get('lang') ||
  // getLanguageCodeFromNavigator() ||
  // 'en';

  function updateFont(language: TSupportedLanguages) {
    if (language === 'he') {
      document.body.style.fontFamily =
        "Alef, 'Lucida Grande', 'Helvetica Neue', sans-serif";
    } else {
      document.body.style.fontFamily =
        "'Lucida Grande', 'Helvetica Neue', sans-serif";
    }
  }

  function updateCSSVars(language: TSupportedLanguages) {
    const isRtl = rtlLangugages.indexOf(language) !== -1;
    if (isRtl) {
      document.documentElement.style.setProperty(
        '--floater-box-shadow',
        '-5px 5px #0000004d',
      );
    } else {
      document.documentElement.style.setProperty(
        '--floater-box-shadow',
        '5px 5px #0000004d',
      );
    }
  }

  async function setLanguage(language: TSupportedLanguages) {
    if (language !== currentUserLanguage) {
      await I18n.setLanguage(language);

      dispatch(updateCurrentUser({ language }));
      window.localStorage.setItem('language', language);
      setFallbackLanguage(language);
      updateFont(language);
      updateCSSVars(language);
      dispatch({ type: 'set-language', payload: { language } });
    }
  }

  function initCurrentLanguage() {
    const urlParamLanguage = new URLSearchParams(window.location.search).get(
      'lang',
    );
    if (currentUserLanguage) {
      setLanguage(currentUserLanguage);
    } else if (localStorageLanguage) {
      setLanguage(localStorageLanguage as TSupportedLanguages);
    } else if (urlParamLanguage) {
      setLanguage(urlParamLanguage as TSupportedLanguages);
    } else {
      setLanguage(getLanguageCodeFromNavigator());
    }
  }

  useEffect(() => {
    if (language) {
      if (language === 'he') {
        setPrettyLanguage('עברית');
      } else if (language === 'en') {
        setPrettyLanguage('English');
      }
    }
  }, [language]);

  function showLanguageSelector() {
    setIsShowLanguageSelector(true);
  }

  function renderLanguageSelector() {
    const languages: TLanguage[] = [
      { code: 'ar', label: 'Arabic', supported: false },
      { code: 'zh-tw', label: 'Chinese (Simplified)', supported: false },
      { code: 'zh-cn', label: 'Chinese (Tranditional)', supported: false },
      { code: 'en', label: 'English', supported: true },
      { code: 'he', label: 'עברית', supported: true },
      { code: 'hi', label: 'Hindu', supported: false },
      { code: 'ms', label: 'Malay', supported: false },
      { code: 'ru', label: 'Russian', supported: false },
      { code: 'es', label: 'Spanish', supported: false },
    ];

    function handleClose() {
      setShowComingSoon(null);
      setIsShowLanguageSelector(false);
    }

    function handleLanguageSelected(language: TLanguage) {
      requestLanguage({
        languageCode: language.code,
      });

      if (language.supported) {
        setLanguage(language.code);
        handleClose();
      } else {
        setShowComingSoon(language);
      }
    }

    return ReactDOM.createPortal(
      <Modal
        title={t('Select Your Language')}
        showClose
        show={isShowLanguageSelector}
        onClose={handleClose}
      >
        <div className={styles.useCurrentLanguage}>
          {!showComingSoon && (
            <div className={styles.languageList}>
              {languages.map(_language => (
                <Button
                  key={_language.code}
                  variant="ghost-muted"
                  label={_language.label}
                  icon={
                    _language.code === currentUserLanguage ? 'fa fa-check' : ''
                  }
                  onClick={handleLanguageSelected.bind(null, _language)}
                  size="sm"
                  highlightIcon
                />
              ))}
            </div>
          )}
          {showComingSoon && (
            <div className={styles.comingSoon}>
              Support for {showComingSoon.label} is coming soon!
            </div>
          )}
          <div className={styles.actions}>
            <Button variant="ghost" label={t('Close')} onClick={handleClose} />
          </div>
        </div>
      </Modal>,
      document.querySelector('#modal')!,
    );
  }

  const isRtl = rtlLangugages.indexOf(language) !== -1;

  return {
    isRtl,
    language: language || 'en',
    prettyLanguage,
    setLanguage,
    initCurrentLanguage,
    showLanguageSelector,
    renderLanguageSelector,
  };
}
