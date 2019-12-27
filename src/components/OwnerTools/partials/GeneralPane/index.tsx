import React, { useState, useRef, forwardRef, useEffect } from 'react';
import cx from 'classnames';
import firebase from 'firebase/app';
import styles from './index.module.scss';
import paneStyles from '../index.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import BackButton from '../BackButton';
import { useTransitionPane } from '../../hooks';
import useFeed from '../../../../hooks/use-feed';
import useFocusTrap from '../../../../hooks/use-focus-trap';
import { useTypedDispatch } from '../../../../state/reducer';
import LabelledInput from '../../../LabelledInput';
import Button from '../../../Button';
import useProcessing from '../../../../hooks/use-processing';
import { useHistory } from 'react-router-dom';

function DeleteFeed() {
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [feedName, setFeedName] = useState('');
  const { t } = useTranslation();
  const feed = useFeed();
  const processing = useProcessing();
  const history = useHistory();

  function handleShowDeleteForm() {
    setShowDeleteForm(true);
  }

  async function handleDelete() {
    if (feedName !== feed?.name) {
      return;
    }

    processing.start();
    await firebase
      .firestore()
      .doc(`/feeds/${feed?.id}`)
      .delete();
    history.push('/my-feeds');
    processing.stop();
  }

  return (
    <div className={styles.deleteFeed}>
      {!showDeleteForm && (
        <Button label={t('Delete Feed')} onClick={handleShowDeleteForm} />
      )}
      {showDeleteForm && (
        <form onSubmit={handleDelete}>
          <LabelledInput
            variant="owner-tools"
            id="feedName"
            label={t("Enter Your Feed's Name")}
            onValueChange={setFeedName}
            value={feedName}
            fullWidth
            placeholder={feed?.name}
          />
          <div className="margin-h-md" />
          <Button
            label={t('Delete Feed')}
            onClick={handleDelete}
            disabled={feedName !== feed?.name}
            showSpinner={processing.state}
          />
        </form>
      )}
    </div>
  );
}

function GeneralPane({ onBack }: { onBack: () => void }, ref: any) {
  const { t } = useTranslation();
  const feed = useFeed();
  const dispatch = useTypedDispatch();
  const wrapper = useTransitionPane(ref);
  const isFirstRun = useRef(true);
  const [focusTrapStart, focusTrapEnd] = useFocusTrap({ autoFocus: false });

  const [feedName, setFeedName] = useState(feed?.name ?? '');

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    dispatch({
      type: 'set-feed-name',
      payload: {
        name: feedName,
      },
    });
  }, [feedName]);

  return (
    <div ref={wrapper} className={cx(styles.wrapper, paneStyles.wrapper)}>
      {focusTrapStart()}
      <div className={cx(styles.paneTitle, paneStyles.title)}>
        <BackButton onClick={onBack} />
        <Trans>General</Trans>
      </div>
      <div className={paneStyles.paneContent}>
        <LabelledInput
          variant="owner-tools"
          id="feedName"
          label={t('Feed Name')}
          onValueChange={setFeedName}
          value={feedName}
          fullWidth
          disabled
        />
        <div className="margin-h-md" />
        <DeleteFeed />
        {focusTrapEnd()}
      </div>
    </div>
  );
}

export default forwardRef(GeneralPane);
