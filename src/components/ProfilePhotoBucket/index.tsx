import React, { useState } from 'react';
import cx from 'classnames';
import styles from './index.module.scss';
import Spinner from '../Spinner';
import { uploadFile } from '../../utils';
import UserPhoto from '../UserPhoto';

export default function ProfilePhotoBucket({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setIsProcessing(true);
      const url = await uploadFile(e.target.files[0]);
      // setUrl(url);
      onChange(url);
      setIsProcessing(false);
    }
  }

  return (
    <div className={cx(styles.wrapper, value.startsWith('!') && styles.avatar)}>
      {isProcessing && (
        <Spinner size="md" className={styles.spinner} color="#ffffff" />
      )}
      <input
        type="file"
        className={styles.input}
        onChange={handleInputChange}
      />

      <div className={styles.overlay}>
        <div className={styles.label}>Replace</div>
        <i className="fa fa-photo" />
      </div>
      <div className={styles.focusRect} />
      <UserPhoto size="x-lg" photo={value} />
    </div>
  );
}
