import React, { useState, useRef, forwardRef, useEffect } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import paneStyles from '../index.module.scss';
import { Trans, useTranslation } from 'react-i18next';
import BackButton from '../BackButton';
import { useTransitionPane } from '../../hooks';
import LabelledCheckbox from '../../../LabelledCheckbox';
import useFeed from '../../../../hooks/use-feed';
import useFocusTrap from '../../../../hooks/use-focus-trap';
import Select from '../../../Select';
import { useTypedDispatch } from '../../../../state/reducer';
import { TUserType } from '@feedfarm-shared/types';

function RulesPane({ onBack }: { onBack: () => void }, ref: any) {
  const { t } = useTranslation();
  const feed = useFeed();
  const dispatch = useTypedDispatch();
  const wrapper = useTransitionPane(ref);
  const isFirstRun = useRef(true);

  const [allowsTags, setAllowsTags] = useState(feed?.allowsTags ?? false);
  // prettier-ignore
  const [allowsCommenting, setAllowsCommenting] = useState(feed?.allowsCommenting ?? false);
  // prettier-ignore
  const [allowsReactions, setAllowsReactions] = useState(feed?.allowsReactions ?? false);

  // prettier-ignore
  const [whoCanRead, setWhoCanRead] = useState<TUserType>(feed?.whoCanRead ?? 'guest');
  // prettier-ignore
  const [whoCanWrite, setWhoCanWrite] = useState<TUserType>(feed?.whoCanWrite ?? 'guest');
  const [focusTrapStart, focusTrapEnd] = useFocusTrap({ autoFocus: false });

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    dispatch({
      type: 'set-feed-rules',
      payload: {
        allowsCommenting,
        allowsReactions,
        allowsTags,
        whoCanRead,
        whoCanWrite,
      },
    });
  }, [allowsCommenting, allowsReactions, allowsTags, whoCanRead, whoCanWrite]);

  const userTypeOptions: { label: string; value: TUserType }[] = [
    { value: 'guest', label: t('🌎 Everyone') },
    { value: 'member', label: t('👤 Members') },
    { value: 'me', label: t('❌ Only Me') },
  ];

  return (
    <div ref={wrapper} className={cx(styles.wrapper, paneStyles.wrapper)}>
      {focusTrapStart()}
      <div className={cx(styles.paneTitle, paneStyles.title)}>
        <BackButton onClick={onBack} />
        <Trans>Rules</Trans>
      </div>
      <div className={paneStyles.paneContent}>
        <LabelledCheckbox
          id="allows-commenting"
          label={t('Allow Comments')}
          onValueChange={setAllowsCommenting}
          value={allowsCommenting}
        />
        <div className="margin-h-md" />
        <LabelledCheckbox
          id="allows-reactions"
          label={t('Allow Reactions')}
          onValueChange={setAllowsReactions}
          value={allowsReactions}
        />
        <div className="margin-h-md" />
        <LabelledCheckbox
          id="allows-tags"
          label={t('Allow Tags')}
          onValueChange={setAllowsTags}
          value={allowsTags}
        />
        <div className="margin-h-md" />
        <div className={styles.selectLabel}>
          <Trans>Who Can Read?</Trans>
        </div>
        <Select
          options={userTypeOptions}
          value={whoCanRead}
          onValueChange={setWhoCanRead}
          fullWidth
          variant="owner-tools"
        />
        <div className="margin-h-md" />
        <div className={styles.selectLabel}>
          <Trans>Who Can Post, Comment or React?</Trans>
        </div>
        <Select
          options={userTypeOptions}
          value={whoCanWrite}
          onValueChange={setWhoCanWrite}
          fullWidth
          variant="owner-tools"
        />
        {focusTrapEnd()}
      </div>
    </div>
  );
}

export default forwardRef(RulesPane);
