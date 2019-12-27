import React, { useState, Suspense, lazy } from 'react';
import styles from './index.module.scss';
import Spinner from 'react-spinner-material';
import { uploadFile } from '../../utils';
// import ImageEditor from '../../components/ImageEditor';

export default function PhotoBucket({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [url, setUrl] = useState(value);
  const [editorUrl, setEditorUrl] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setIsProcessing(true);
      const url = await uploadFile(e.target.files[0]);
      setEditorUrl(url);
    }
  }

  function handleRemove() {
    setUrl('');
    onChange('');
  }

  if (url) {
    return (
      <div className={styles.wrapper}>
        <button onClick={handleRemove} className={styles.removeButton}>
          <i className="fa fa-times" />
        </button>
        <img src={url} alt="User" />
      </div>
    );
  }

  function handleCloseEditor() {
    setEditorUrl(undefined);
    setIsProcessing(false);
  }

  async function handleUploadFromEditor(image: Blob) {
    setEditorUrl(undefined);
    const url = await uploadFile(image as File);
    setUrl(url);
    onChange(url);
    setIsProcessing(false);
  }

  return (
    <div className={styles.wrapper}>
      {!isProcessing && <i className="fa fa-plus" />}
      {isProcessing && (
        <Spinner size={20} spinnerWidth={2} spinnerColor="#484848" visible />
      )}
      <input
        type="file"
        className={styles.input}
        onChange={handleInputChange}
      />
      <div className={styles.focusRect} />
    </div>
  );
}
