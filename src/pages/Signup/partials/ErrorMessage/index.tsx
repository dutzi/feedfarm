import React from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.scss';
import { Trans } from 'react-i18next';

export default function ErrorMessage({ error }: { error: string }) {
  return (
    <div className={styles.wrapper}>
      {error === 'auth/invalid-email' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.invalidEmail.title">
              Email is invalid
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.invalidEmail.body">
            Did you submit your name instead?
          </Trans>
        </>
      )}
      {error === 'auth/email-already-in-use' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.emailAlreadyInUse.title">
              Email is already in use
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.emailAlreadyInUse.body">
            Try a different one or try <Link to="/signin">signing in</Link>.
          </Trans>
        </>
      )}
      {error === 'auth/weak-password' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.weakPassword.title">
              Password is too weak
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.weakPassword.body">
            Try a better one. You can do it.
          </Trans>
        </>
      )}
      {error === 'feedfarm/invalid-username' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.invalidUsername.title">
              Invalid username
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.invalidUsername.body">
            Usernames can only contain letters, numbers and _ (underscore)
          </Trans>
        </>
      )}
      {error === 'feedfarm/username-taken' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.usernameTaken.title">
              Username taken
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.usernameTaken.body">
            Username is taken, try something else...
          </Trans>
        </>
      )}
      {error === 'auth/user-not-found' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.userNotFound.title">
              User not found
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.userNotFound.body">
            The email address you've used was not found
          </Trans>
        </>
      )}
      {error === 'auth/wrong-password' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.wrongPassword.title">
              Wrong password
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.wrongPassword.body">
            The password you entered does not match the email address
          </Trans>
        </>
      )}
      {error === 'feedfarm/password-reset' && (
        <>
          <strong>
            <Trans i18nKey="signup.error.passwordReset.title">
              An email was sent
            </Trans>
          </strong>
          <br />
          <div className="margin-h-sm" />
          <Trans i18nKey="signup.error.passwordReset.body">
            Check your inbox for a reset link
          </Trans>
        </>
      )}
    </div>
  );
}
