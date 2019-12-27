import React, { useState } from 'react';
import styles from './index.module.scss';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import LabelledInput from '../../components/LabelledInput';
import SubmitButton from '../../components/SubmitButton';
import ErrorMessage from './partials/ErrorMessage';
import useProcessing from '../../hooks/use-processing';
import useCurrentUser from '../../hooks/use-current-user';
import { useTranslation } from 'react-i18next';
// import useAnimateElements from '../../hooks/use-animate-elements';
import { IGuestUser } from '@feedfarm-shared/types';
import { migrateUser } from '../../firebase-functions';

type TMode = 'signup' | 'reset-password';

export default function Signup() {
  const [formError, setFormError] = useState('');
  const processingSignup = useProcessing();
  const [mode, setMode] = useState<TMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser] = useCurrentUser();
  const history = useHistory();
  const { t } = useTranslation();
  // const wrapper = useAnimateElements('*');

  async function signup() {
    const token = ((currentUser as unknown) as IGuestUser).token;
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    await migrateUser({
      token,
      email,
    });
  }

  async function resetPassword() {
    await firebase.auth().sendPasswordResetEmail(email);
    setMode('signup');
  }

  async function handleSubmit() {
    setFormError('');
    processingSignup.start();

    try {
      if (mode === 'signup') {
        await signup();
        history.push('/my-feeds');
      } else if (mode === 'reset-password') {
        await resetPassword();
      }
    } catch (err) {
      setFormError(err.code);
    } finally {
      processingSignup.stop();
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form}>
        <h1>{t('Sign Up')}</h1>
        <div className={styles.formField}>
          <LabelledInput
            testId="emailInput"
            value={email}
            onValueChange={setEmail}
            id="email"
            label={t('signup.email', 'Email')}
            type="email"
            trimValue
            fullWidth
            autoFocus
          />
        </div>
        {mode === 'signup' && (
          <div className={styles.formField}>
            <LabelledInput
              testId="passwordInput"
              value={password}
              onValueChange={setPassword}
              id="password"
              label={t('signup.password', 'Password')}
              type="password"
              trimValue
              autoComplete="new-password"
              fullWidth
            />
          </div>
        )}
        <div className="margin-h-xlg" />
        <SubmitButton
          onClick={handleSubmit}
          label={t('signup.signUp', 'Sign Up')}
          showSpinner={processingSignup.state}
          disabled={!email || (mode === 'signup' && !password)}
        />

        {formError && (
          <>
            <div className="margin-h-xlg" />
            <ErrorMessage error={formError} />
          </>
        )}
      </form>
    </div>
  );
}
