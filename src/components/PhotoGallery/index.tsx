import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../../state/reducer';
import usePreventScroll from '../../hooks/use-prevent-scroll';
import useEscapeToClose from '../../hooks/use-escape-to-close';

export default function PhotoGallery() {
  const gallery = useSelector((state: IState) => state.ui.gallery);
  const dispatch = useDispatch();
  usePreventScroll();
  useEscapeToClose(handleClose);

  function handleClose() {
    dispatch({ type: 'close-gallery' });
  }

  if (!gallery) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.backdrop} onClick={handleClose} />
      <button className={styles.closeButton} onClick={handleClose}>
        ×
      </button>
      <div className={styles.photoWrapper}>
        <img className={styles.photo} src={gallery.photoUrl} alt="User" />
      </div>
    </div>
  );
}
