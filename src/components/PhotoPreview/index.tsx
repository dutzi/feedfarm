import React from 'react';
import styles from './index.module.scss';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import useMaintainRatio from '../../hooks/use-maintain-ratio';

export default function PhotoPreview({
  photo,
  fullHeight,
  alt,
}: {
  photo: string | undefined;
  fullHeight?: boolean;
  alt: string;
}) {
  const dispatch = useDispatch();
  const ref = useMaintainRatio<HTMLDivElement>(4 / 3);

  function handleViewImage(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch({
      type: 'open-gallery',
      payload: { photoUrl: photo },
    });
  }

  return (
    <button
      ref={ref as any}
      className={cx(
        styles.imageButton,
        fullHeight && styles.fullHeight,
        !photo && styles.disabled,
      )}
      onClick={handleViewImage}
      disabled={!photo}
    >
      {photo ? (
        <img className={styles.profileImage} alt={alt} src={photo} />
      ) : (
        <div className={styles.noPhoto}>
          <i className="fa fa-photo" />
        </div>
      )}
    </button>
  );
}
