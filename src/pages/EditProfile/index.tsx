import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import styles from './index.module.scss';
import LabelledInput from '../../components/LabelledInput';
import Label from '../../components/Label';
import { IUser, TUserEditable } from '@feedfarm-shared/types';
import SubmitButton from '../../components/SubmitButton';
import LabelledTextarea from '../../components/LabelledTextarea';
import withProfile from './with-profile';
import useProcessing from '../../hooks/use-processing';
import { updateCurrentUser } from '../../state/actions';
import { useTranslation } from 'react-i18next';
import ProfilePhotoBucket from '../../components/ProfilePhotoBucket';
import useCurrentUser from '../../hooks/use-current-user';
import Button from '../../components/Button';

export default function EditProfile({
  mode,
}: {
  mode: 'complete-profile' | 'edit';
}) {
  const processing = useProcessing();
  const [currentUser] = useCurrentUser();
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser) {
      setBio(currentUser.bio);
      setUsername(currentUser.username);
      setUserPhoto(currentUser.userPhoto);
    }
  }, [currentUser]);

  async function handleSubmit(force?: boolean) {
    setFormError('');

    processing.start();

    const user: Partial<TUserEditable> = {
      username,
      bio,
      userPhoto,
      isTestUser: !!(window as any).signupAsTestUser as boolean,
    };

    await dispatch(updateCurrentUser(user));

    processing.stop();
  }

  // useEffect(() => {
  //   readLocationFromIP().then(location => {
  //     console.log({ location });
  //     getLocationFromGoogleApi({
  //       lat: Number(location.latitude),
  //       lng: Number(location.longitude),
  //     });
  //   });
  // }, []);

  function handleRevertPhoto() {
    setUserPhoto(currentUser!.birthAvatar);
  }

  const isEdit = mode === 'edit';

  return (
    <div className={cx(styles.wrapper, isEdit && styles.edit)}>
      {!isEdit ? (
        <>
          <h1>{t('editProfile.title1', 'Complete Your Profile')}</h1>
        </>
      ) : (
        <h1>{t('Your Profile')}</h1>
      )}
      <form className={styles.form}>
        <div className={styles.formField}>
          <LabelledInput
            value={username}
            id="username"
            label={t('editProfile.name', 'Name')}
            onValueChange={setUsername}
            fullWidth
          />
        </div>
        <div className={styles.formField}>
          <LabelledTextarea
            testId="bioInput"
            onValueChange={setBio}
            value={bio}
            autoFocus={!isEdit}
            id="bio"
            label={t('editProfile.bio', 'Bio')}
            maxLength={280}
          />
        </div>
        <div className={cx(styles.formField, styles.userPhoto)}>
          <Label>{t('Profile Photo')}</Label>
          <div>
            <ProfilePhotoBucket value={userPhoto} onChange={setUserPhoto} />
            <div className="margin-h-md" />
            <Button
              size="sm"
              variant="ghost-muted"
              label={t('Revert To Avatar')}
              onClick={handleRevertPhoto}
            />
          </div>
        </div>
        <div className="margin-h-xlg" />
        {formError && <div className={styles.error}>{formError}</div>}
        <SubmitButton
          testId="submitButton"
          label={isEdit ? t('Save Changes') : t('Complete My Profile')}
          onClick={handleSubmit}
          showSpinner={processing.state}
        />
      </form>
    </div>
  );
}
