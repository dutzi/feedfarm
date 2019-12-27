import React, { useState, useRef, forwardRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import { useSelector, shallowEqual } from 'react-redux';
import firebase from 'firebase/app';
import useProcessing from '../../hooks/use-processing';
import { usePopFromLeft, usePaneAnimator } from './hooks';
import {
  IState,
  useTypedDispatch,
  useTypedSelector,
} from '../../state/reducer';
import { TPaneType } from './types';
import Spinner from '../Spinner';
import StylePane from './partials/StylePane';
import RulesPane from './partials/RulesPane';
import RolesPane from './partials/RolesPane';
import GeneralPane from './partials/GeneralPane';
import useFocusTrap from '../../hooks/use-focus-trap';
import useFeed from '../../hooks/use-feed';
import { getUserRoles } from '../../utils';
import useCurrentUser from '../../hooks/use-current-user';
import useCurrentLanguage from '../../hooks/use-current-language';
import { Trans, useTranslation } from 'react-i18next';
import { IFeed } from '@feedfarm-shared/types';
import { updateFeedSettings } from '../../firebase-functions';
import mergeRefs from 'typed-merge-refs';
// import { IFeed } from '@feedfarm-shared/types';
// import { IFeed } from '../../../functions/src/feedfarm-shared/types';

function SaveButton({
  isSaving,
  onSave,
}: {
  isSaving: boolean;
  onSave: (feed: IFeed) => void;
}) {
  const hasUnsavedChanges = useSelector(
    (state: IState) => state.feed.hasUnsavedChanges,
  );
  const { isRtl } = useCurrentLanguage();
  const feed = useFeed();

  function handleSave() {
    onSave(feed!);
  }

  return (
    <button
      className={styles.saveButton}
      disabled={!hasUnsavedChanges}
      onClick={handleSave}
      style={{ [isRtl ? 'left' : 'right']: '-60px' }}
    >
      {isSaving ? (
        <Spinner size="sm" color="#ffffff" />
      ) : (
        <i className="fa fa-save" />
      )}
    </button>
  );
}

function UnsavedChanged({
  onDismiss,
  onSave,
}: {
  onDismiss: () => void;
  onSave: (feed: IFeed) => void;
}) {
  const { t } = useTranslation();
  const feed = useFeed();
  const [showWarning, setShowWarning] = useState(false);
  const hasUnsavedChanges = useSelector(
    (state: IState) => state.feed.hasUnsavedChanges,
  );
  const dispatch = useTypedDispatch();
  const [feedAfterDiscard, setFeedAfterDiscard] = useState<IFeed>();

  useEffect(() => {
    if (hasUnsavedChanges) {
      window.localStorage.setItem(
        `feed-changes-${feed?.id}`,
        JSON.stringify(feed),
      );
    }
  }, [feed, hasUnsavedChanges]);

  useEffect(() => {
    const unsavedChanges = window.localStorage.getItem(
      `feed-changes-${feed?.id}`,
    );
    if (unsavedChanges) {
      setFeedAfterDiscard(feed);
      const newFeed: IFeed = JSON.parse(unsavedChanges);
      dispatch({ type: 'set-feed', payload: { feed: newFeed } });
      setShowWarning(true);
    }
  }, []);

  if (!showWarning) {
    return null;
  }

  function handleDiscard() {
    window.localStorage.removeItem(`feed-changes-${feed?.id}`);
    dispatch({ type: 'set-feed', payload: { feed: feedAfterDiscard! } });
    setShowWarning(false);
    onDismiss();
  }

  async function handleSave() {
    const unsavedChanges = window.localStorage.getItem(
      `feed-changes-${feed?.id}`,
    );
    if (unsavedChanges) {
      onSave(JSON.parse(unsavedChanges) as IFeed);
    }
    setShowWarning(false);
    onDismiss();
  }

  return (
    <div className={styles.unsavedChanges}>
      <div className={styles.warning}>
        <i className="fa fa-exclamation" />
        <div className={styles.text}>
          <Trans i18nKey="unsavedChanges.text">
            You've made changes in a previous session that were not saved, would
            you like to save them now?
          </Trans>
        </div>
      </div>
      <div className={styles.buttons}>
        <div></div>
        <button className={styles.button} onClick={handleDiscard}>
          {t('Discard')}
        </button>
        <button className={styles.button} onClick={handleSave}>
          {t('Save')}
        </button>
      </div>
    </div>
  );
}

function OwnerTools() {
  const [wrapper, well] = usePopFromLeft();
  const [pane, setPane] = useState<TPaneType>('main');
  const paneAnimator = usePaneAnimator({ pane, wrapper });
  const [focusTrapStart, focusTrapEnd] = useFocusTrap({
    autoFocus: false,
    betterPreventScroll: true,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const expandTimeline = useRef<gsap.core.Timeline>();
  const feed = useFeed();
  const [currentUser] = useCurrentUser();
  const [showSaveChangesWarning, setShowSaveChangesWarning] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const dispatch = useTypedDispatch();
  const saving = useProcessing();

  async function handleSave(feed: IFeed) {
    saving.start();
    await updateFeedSettings({ feed });
    dispatch({ type: 'saved-changes' });
    window.localStorage.removeItem(`feed-changes-${feed?.id}`);
    saving.stop();
  }

  useEffect(() => {
    const unsavedChanges = window.localStorage.getItem(
      `feed-changes-${feed?.id}`,
    );
    if (unsavedChanges) {
      setShowSaveChangesWarning(true);
    }
  }, []);

  function handleShowPane(pane: TPaneType) {
    setPane(pane);
  }

  // useEffect(() => {
  //   setPane('style');
  // }, []);

  async function handleBack() {
    if (isExpanded) {
      await handleToggleExpand();
    }
    setPane('main');
  }

  function handleToggleExpand() {
    setIsExpanded(!isExpanded);

    if (isExpanded) {
      return expandTimeline.current?.reverse();
    } else {
      return expandTimeline.current?.play();
    }
  }

  useEffect(() => {
    if (well.current) {
      expandTimeline.current = gsap
        .timeline()
        .to(well.current, {
          width: 'calc(50vw)',
          duration: 0.75,
          ease: 'back.out(1.3)',
        })
        .to(well.current, {
          delay: 0.5,
          x: '-=5',
          y: '-=5',
          boxShadow: '5px 5px #00000088',
          background: '#8c8c8c',
        })
        .pause();
    }
  }, [well.current]);

  function remountAll() {
    setShowContent(false);
    setShowContent(true);
  }

  function handleDismissChangesWarning() {
    setShowSaveChangesWarning(false);
    remountAll();
  }

  if (!feed) {
    return null;
  }

  const userRoles = getUserRoles(feed, currentUser);

  if (!userRoles.owner) {
    return null;
  }

  if (!showContent) {
    return null;
  }

  return (
    <div
      ref={wrapper}
      className={cx(
        styles.wrapper,
        showSaveChangesWarning && styles.showSaveChangesWarning,
      )}
    >
      <div
        ref={mergeRefs(well, paneAnimator.refs.well)}
        className={styles.well}
      >
        {focusTrapStart()}
        <div className={styles.overflowHidden}>
          <div ref={paneAnimator.refs.toolbar} className={styles.toolbar}>
            <button
              onClick={handleShowPane.bind(null, 'style')}
              className={cx(styles.button, styles.style)}
            >
              <i className="fa fa-pencil-ruler" />
            </button>
            <button
              onClick={handleShowPane.bind(null, 'rules')}
              className={cx(styles.button, styles.rules)}
            >
              <i className="fa fa-exclamation-triangle" />
            </button>
            <button
              onClick={handleShowPane.bind(null, 'roles')}
              className={cx(styles.button, styles.roles)}
            >
              <i className="fa fa-user-tag" />
            </button>
            <button
              onClick={handleShowPane.bind(null, 'general')}
              className={cx(styles.button, styles.general)}
            >
              <i className="fa fa-cog" />
            </button>
          </div>
          {focusTrapEnd()}
          <StylePane ref={paneAnimator.refs.panes.style} onBack={handleBack} />
          <RulesPane ref={paneAnimator.refs.panes.rules} onBack={handleBack} />
          <RolesPane
            ref={paneAnimator.refs.panes.roles}
            onBack={handleBack}
            onToggleExpand={handleToggleExpand}
            isExpanded={isExpanded}
          />
          <GeneralPane
            ref={paneAnimator.refs.panes.general}
            onBack={handleBack}
          />
        </div>
        <div className={styles.sidebar}>
          <SaveButton onSave={handleSave} isSaving={saving.state} />
          <UnsavedChanged
            onSave={handleSave}
            onDismiss={handleDismissChangesWarning}
          />
        </div>
      </div>
    </div>
  );
}

export default forwardRef(OwnerTools);
