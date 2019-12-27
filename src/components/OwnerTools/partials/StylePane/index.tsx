import React, { forwardRef } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import paneStyles from '../index.module.scss';
import { TFeedThemeType } from '@feedfarm-shared/types';
import { Trans, useTranslation } from 'react-i18next';
import BackButton from '../BackButton';
import { useTransitionPane } from '../../hooks';
import useFocusTrap from '../../../../hooks/use-focus-trap';
import { useTypedDispatch } from '../../../../state/reducer';

type TPaneTypes = 'main' | 'style';

function StylePane({ onBack }: { onBack: () => void }, ref: any) {
  const { t } = useTranslation();
  const currentTheme = 'default';
  const dispatch = useTypedDispatch();
  const wrapper = useTransitionPane(ref);
  const [focusTrapStart, focusTrapEnd] = useFocusTrap({ autoFocus: false });

  const themes = [
    {
      label: t('Feed Farm Dark'),
      id: 'default',
      darkBackground: true,
      style: {
        background: 'linear-gradient(#313131,#4b4b4b)',
      },
    },
    {
      label: t('Feed Farm Light'),
      id: 'light',
      darkBackground: false,
      style: {
        background: 'linear-gradient(rgb(255, 255, 255), rgb(249, 242, 201))',
      },
    },
    {
      label: t('Bars'),
      id: 'bars',
      darkBackground: true,
      style: {
        background: 'linear-gradient(#2196F3 49%, #03A9F4 50%)',
        backgroundSize: '100% 50px',
        backgroundRepeat: 'repeat-y',
      },
    },
    {
      label: t('Messages'),
      id: 'messages',
      darkBackground: false,
      style: {
        background: 'linear-gradient(#4299f8,#ffffff)',
      },
    },
    {
      label: t('Notebook'),
      id: 'notebook',
      darkBackground: false,
      style: {
        background: 'linear-gradient(white 48%, #4299f8 50%, white 52%)',
        backgroundSize: '100% 30px',
        backgroundRepeat: 'repeat-y',
      },
    },
  ];

  function handleSelectTheme(theme: TFeedThemeType) {
    dispatch({ type: 'set-feed-theme', payload: { theme } });
  }

  return (
    <div ref={wrapper} className={cx(styles.wrapper, paneStyles.wrapper)}>
      {focusTrapStart()}
      <div className={cx(styles.paneTitle, paneStyles.title)}>
        <BackButton onClick={onBack} />
        <Trans>Themes</Trans>
      </div>
      <div className={paneStyles.paneContent}>
        {themes.map(theme => (
          <button
            key={theme.id}
            className={cx(
              styles.themeButton,
              currentTheme === theme.id,
              theme.darkBackground && styles.lightText,
            )}
            style={theme.style}
            onClick={handleSelectTheme.bind(null, theme.id as TFeedThemeType)}
          >
            <span className={styles.label}>{theme.label}</span>
          </button>
        ))}
        {focusTrapEnd()}
      </div>
    </div>
  );
}

export default forwardRef(StylePane);
