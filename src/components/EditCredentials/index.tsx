import React, { useState, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import firebase from 'firebase/app';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../state/reducer';
import styles from './index.module.scss';
import LabelledInput from '../../components/LabelledInput';
import { IUser } from '@feedfarm-shared/types';
import SubmitButton from '../../components/SubmitButton';
import Label from '../../components/Label';
import Select from '../../components/Select';
import { useFormState } from 'react-use-form-state';
import useIsCurrentUserAdmin from '../../hooks/use-is-current-user-admin';
import { useTranslation } from 'react-i18next';
import useCurrentUser from '../../hooks/use-current-user';

interface IAllUsersUser {
  label: string;
  value: string;
}

export default function EditCredentials({ uid }: { uid: string }) {
  const [formState, { email, password }] = useFormState();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const impersonatedUser = useSelector(
    (state: IState) => state.currentUser.impersonatedUser,
  );
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  const [allUsersFull, setAllUsersFull] = useState<IUser[]>([]);
  const [initialUser, setInitialUser] = useState<IUser>();
  const [allUsers, setAllUsers] = useState<IAllUsersUser[]>([]);
  const [currentUser] = useCurrentUser();

  useEffect(() => {
    if (!isCurrentUserAdmin) {
      return;
    }

    firebase
      .firestore()
      .collection('/users')
      .get()
      .then(usersCollection => {
        const users = usersCollection.docs.map(userDoc =>
          userDoc.data(),
        ) as IUser[];

        setAllUsersFull(users);

        setAllUsers(
          sortBy(
            users.map(user => ({
              value: user.id,
              label: user.username,
            })),
            [user => user.label.toLowerCase()],
          ),
        );
      });
  }, [isCurrentUserAdmin]);

  function setImpersonate(id: string) {
    dispatch({
      type: 'impersonate',
      payload: { user: allUsersFull.find(user => user.id === id) },
    });
  }

  useEffect(() => {
    if (uid) {
      firebase
        .firestore()
        .doc(`/users/${uid}`)
        .get()
        .then(userDocRef => {
          const user = userDocRef.data() as IUser;
          // TODO rename username -> name
          setInitialUser(user);
          formState.setField('name', user.username);
          formState.setField('email', user.email);
        });
    }
  }, [uid, formState]);

  async function handleSubmit() {
    setIsProcessing(true);

    const needOldPasswordError = t(
      'myProfile.needOldPassword',
      'In order to change your email/password, you must also provide your current password',
    );

    if (initialUser && firebase.auth().currentUser) {
      if (formState.values.email !== initialUser.email) {
        if (formState.values.oldPassword === '') {
          formState.setFieldError('oldPassword', needOldPasswordError);
          setIsProcessing(false);
          return;
        }
        try {
          await firebase
            .auth()
            .signInWithEmailAndPassword(
              initialUser.email,
              formState.values.oldPassword,
            );
          await firebase
            .auth()
            .currentUser!.updateEmail(formState.values.email);
        } catch (err) {
          formState.setFieldError('email', err.message);
        }
      }

      if (formState.values.newPassword !== '') {
        if (formState.values.oldPassword === '') {
          formState.setFieldError('oldPassword', needOldPasswordError);
          setIsProcessing(false);
          return;
        }
        try {
          await firebase
            .auth()
            .signInWithEmailAndPassword(
              initialUser.email,
              formState.values.oldPassword,
            );
          await firebase
            .auth()
            .currentUser!.updatePassword(formState.values.newPassword);
        } catch (err) {
          formState.setFieldError('newPassword', err.message);
        }
      }
    }
    setIsProcessing(false);
  }

  if (!currentUser || currentUser.isGuest) {
    return null;
  }

  return (
    <form className={styles.wrapper}>
      <h1>{t('Your Credentials')}</h1>

      <div className={styles.formField}>
        <LabelledInput
          label={t('Email')}
          {...email('email')}
          fullWidth
          autoFocus
        />
      </div>
      <div className={styles.formField}>
        <LabelledInput
          label={t('Old Password')}
          {...password('oldPassword')}
          fullWidth
        />
      </div>
      <div className={styles.formField}>
        <LabelledInput
          label={t('New Password')}
          {...password('newPassword')}
          fullWidth
        />
      </div>
      {isCurrentUserAdmin && (
        <div className={styles.formField}>
          <Label id="status">{t('Impersonate')}</Label>
          <Select
            onValueChange={setImpersonate}
            value={impersonatedUser && impersonatedUser.id}
            options={allUsers}
          ></Select>
        </div>
      )}
      <div className={styles.error}>{formState.errors.email}</div>
      <div className={styles.error}>{formState.errors.newPassword}</div>
      <div className={styles.error}>{formState.errors.oldPassword}</div>
      <SubmitButton
        label={t('Update Credentials')}
        onClick={handleSubmit}
        showSpinner={isProcessing}
      />
      <div className="margin-h-lg" />
    </form>
  );
}
