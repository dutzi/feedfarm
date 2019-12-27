import React, {
  useState,
  // useImperativeHandle,
  // useRef,
  forwardRef,
  // useEffect,
} from 'react';
import cx from 'classnames';
import firebase from 'firebase/app';
import styles from './index.module.scss';
import paneStyles from '../index.module.scss';
import Input from '../../../Input';
// import { IFeedItemPostPayload, TFeedThemeType } from '@feedfarm-shared/types';
// import SubmitButton from '../../../SubmitButton';
// import Button from '../../../Button';
import { Trans, useTranslation } from 'react-i18next';
// import Textarea from '../../../Textarea';
import useProcessing from '../../../../hooks/use-processing';
// import * as utils from 'feedfarm-shared/utils';
// import useFormValidator from '../../../../hooks/use-form-validator';
// import gsap from 'gsap';
import { IBasicUser } from '@feedfarm-shared/types';
import BackButton from '../BackButton';
import { useTransitionPane } from '../../hooks';
// import LabelledCheckbox from '../../../LabelledCheckbox';
import useFeed from '../../../../hooks/use-feed';
import Spinner from '../../../Spinner';
import { useTypedDispatch } from '../../../../state/reducer';
import useFocusTrap from '../../../../hooks/use-focus-trap';
import useCurrentUser from '../../../../hooks/use-current-user';
import useIsCurrentUserAdmin from '../../../../hooks/use-is-current-user-admin';
import { createUserPlaceholder } from '../../../../firebase-functions';
// import Button from '../../../Button';

function User({
  user,
  onRemove,
  disableRemove,
}: {
  user: IBasicUser;
  onRemove: (user: IBasicUser) => void;
  disableRemove?: boolean;
}) {
  const [currentUser] = useCurrentUser();
  const isMeAdmin = useIsCurrentUserAdmin();
  const { t } = useTranslation();

  function handleRemove() {
    onRemove(user);
  }

  function handleClick() {
    if (isMeAdmin) {
      window.open(
        'https://console.firebase.google.com/u/0/project/feedfarm-app/database/firestore/data' +
          window.encodeURIComponent(`/users/${user.uid}`).replace(/%/g, '~'),
      );
    }
  }

  const isMe = currentUser?.id === user.uid;

  return (
    <div className={styles.user}>
      <span className={styles.username} onClick={handleClick}>
        {user.username} {isMe && t('(you)')}
      </span>
      {!disableRemove && (
        <button className={styles.removeButton} onClick={handleRemove}>
          <i className="fa fa-times" />
        </button>
      )}
    </div>
  );
}

function AddUser({ onAdd }: { onAdd: (user: IBasicUser) => void }) {
  const processing = useProcessing();
  const [email, setEmail] = useState('');

  async function handleAdd() {
    processing.start();
    const emails = email
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    const promises = emails.map(email => {
      return createUserPlaceholder({
        email,
      });
    });

    promises.forEach(promise => {
      promise.then(res => {
        if (!('error' in res)) {
          onAdd(res);
        }
      });
    });

    await Promise.all(promises);

    processing.stop();
    setEmail('');
  }

  return (
    <div className={styles.addUser}>
      <Input
        size="md"
        value={email}
        onValueChange={setEmail}
        fullWidth
        placeholder="john@example.com"
        variant="owner-tools"
        onSubmit={handleAdd}
        disabled={processing.state}
      />
      {processing.state ? (
        <Spinner size="sm" center color="#000000" />
      ) : (
        <button className={styles.addButton} onClick={handleAdd}>
          <i className="fa fa-plus" />
        </button>
      )}
    </div>
  );
}

function EmptyUsersState({ users }: { users?: any[] }) {
  const { t } = useTranslation();

  if (users && users.length > 0) {
    return null;
  }

  return <div className={styles.usersEmptyState}>{t('(no users)')}</div>;
}

function RolesPane(
  {
    onBack,
    onToggleExpand,
    isExpanded,
  }: { onBack: () => void; onToggleExpand: () => void; isExpanded: boolean },
  ref: any,
) {
  const { t } = useTranslation();
  const feed = useFeed();
  const dispatch = useTypedDispatch();
  const wrapper = useTransitionPane(ref);
  const [focusTrapStart, focusTrapEnd] = useFocusTrap({ autoFocus: false });

  function handleRemoveOwner(user: IBasicUser) {
    dispatch({ type: 'remove-feed-owner', payload: { uid: user.uid } });
  }

  function handleRemoveModerator(user: IBasicUser) {
    dispatch({ type: 'remove-feed-moderator', payload: { uid: user.uid } });
  }

  function handleRemoveMember(user: IBasicUser) {
    dispatch({ type: 'remove-feed-member', payload: { uid: user.uid } });
  }

  function handleRemoveBannedUser(user: IBasicUser) {
    dispatch({ type: 'remove-feed-banned-user', payload: { uid: user.uid } });
  }

  function handleAddOwner(user: IBasicUser) {
    dispatch({ type: 'add-feed-owner', payload: { user } });
  }

  function handleAddModerator(user: IBasicUser) {
    dispatch({ type: 'add-feed-moderator', payload: { user } });
  }

  function handleAddMember(user: IBasicUser) {
    dispatch({ type: 'add-feed-member', payload: { user } });
  }

  function handleAddBannedUser(user: IBasicUser) {
    dispatch({ type: 'add-feed-banned-user', payload: { user } });
  }

  if (!feed) {
    return null;
  }

  return (
    <div
      ref={wrapper}
      className={cx(
        styles.wrapper,
        paneStyles.wrapper,
        isExpanded && styles.expanded,
      )}
    >
      {focusTrapStart()}
      <div className={cx(styles.paneTitle, paneStyles.title)}>
        <BackButton onClick={onBack} />
        <Trans>Roles</Trans>
        <button className={styles.toggleExpandButton} onClick={onToggleExpand}>
          <i
            className={`fa fa-${isExpanded ? 'compress' : 'expand'}-arrows-alt`}
          />
        </button>
      </div>
      <div className={paneStyles.paneContent}>
        <div className={styles.infoTip}>
          <i className="fa fa-info" />
          <div className={styles.text}>
            <Trans i18nKey="rolesPane.infoTip">
              Instead of submitting emails one by one, you can enter any number
              of them separated by comma
            </Trans>
          </div>
        </div>
        <div className={styles.groupsWrapper}>
          <div className={styles.usersGroup}>
            <div className={styles.title}>
              <Trans>Owners</Trans>
            </div>
            <div className={styles.usersList}>
              <EmptyUsersState users={feed?.owners} />
              {feed?.owners.map((owner, index) => (
                <User
                  user={owner}
                  onRemove={handleRemoveOwner}
                  disableRemove={index === 0}
                ></User>
              ))}
            </div>
            <AddUser onAdd={handleAddOwner} />
          </div>

          <div className={styles.usersGroup}>
            <div className={styles.title}>
              <Trans>Moderators</Trans>
            </div>
            <div className={styles.usersList}>
              <EmptyUsersState users={feed?.moderators} />
              {feed?.moderators.map(moderator => (
                <User user={moderator} onRemove={handleRemoveModerator}></User>
              ))}
            </div>
            <AddUser onAdd={handleAddModerator} />
          </div>

          <div className={styles.usersGroup}>
            <div className={styles.title}>
              <Trans>Members</Trans>
            </div>
            <div className={styles.usersList}>
              <EmptyUsersState users={feed?.members} />
              {feed?.members.map(member => (
                <User user={member} onRemove={handleRemoveMember}></User>
              ))}
            </div>
            <AddUser onAdd={handleAddMember} />
          </div>
        </div>

        {/* <div className={styles.usersGroup}>
          <div className={styles.title}>
            <Trans>Banned Users</Trans>
          </div>
          <div className={styles.usersList}>
            <EmptyUsersState users={feed?.bannedUsers} />
            {feed?.bannedUsers.map(bannedUser => (
              <User user={bannedUser} onRemove={handleRemoveBannedUser}></User>
            ))}
          </div>
          <AddUser onAdd={handleAddBannedUser} />
        </div> */}

        {/* <Button variant="ghost" label={t('Save & Close')} />
        <Button variant="ghost" label={t('Close Without Saving')} /> */}
        {focusTrapEnd()}
      </div>
    </div>
  );
}

export default forwardRef(RolesPane);
