import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.module.scss';
import LabelledInput from '../../components/LabelledInput';
import SubmitButton from '../../components/SubmitButton';
import firebase from 'firebase/app';
import ErrorMessage from '../Signup/partials/ErrorMessage';
import Button from '../../components/Button';
import useCurrentUser from '../../hooks/use-current-user';
import useAnimateElements from '../../hooks/use-animate-elements';
import { useTranslation } from 'react-i18next';

type TMode = 'signin' | 'reset-password';

export default function Signin() {
  const history = useHistory();
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<TMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser] = useCurrentUser();
  const { t } = useTranslation();
  const wrapper = useAnimateElements('*');

  async function handleSubmit() {
    setIsProcessing(true);
    try {
      if (mode === 'signin') {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } else {
        await firebase.auth().sendPasswordResetEmail(email);
        setFormError('feedfarm/password-reset');
        setIsProcessing(false);
      }
    } catch (err) {
      setFormError(err.code);
      setIsProcessing(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      history.push('/');
    }
  }, [currentUser]);

  function handleToggleForgotPassword() {
    setMode(mode === 'signin' ? 'reset-password' : 'signin');
  }

  return (
    <div ref={wrapper} className={styles.wrapper}>
      <form className={styles.form}>
        <h1>
          {mode === 'signin'
            ? t('signin.singin', 'Sign In')
            : t('Reset Password')}
        </h1>
        <div className={styles.formField}>
          <LabelledInput
            autoFocus
            id="email"
            label={t('signin.email', 'Email')}
            type="email"
            value={email}
            onValueChange={setEmail}
            fullWidth
          />
        </div>
        {mode === 'signin' && (
          <div className={styles.formField}>
            <LabelledInput
              id="password"
              label={t('signin.password', 'Password')}
              type="password"
              value={password}
              onValueChange={setPassword}
              fullWidth
            />
          </div>
        )}
        <div className="margin-h-xlg" />
        <SubmitButton
          onClick={handleSubmit}
          label={mode === 'signin' ? t('Sign In') : t('Reset Password')}
          showSpinner={isProcessing}
        />
        {formError && (
          <>
            <div className="margin-h-xlg" />
            <ErrorMessage error={formError} />
          </>
        )}
      </form>
      <div className="margin-h-md" />
      <div className={styles.resetPasswordWrapper}>
        <Button
          label={
            mode === 'signin'
              ? t('signin.forgotYourPassword', 'Forgot your password?')
              : t('signin.backToLogin', 'Back to login')
          }
          variant="link"
          onClick={handleToggleForgotPassword}
        />
      </div>
    </div>
  );
}
