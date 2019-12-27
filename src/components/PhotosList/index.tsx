import React from 'react';
import styles from './index.module.scss';
import PhotoPreview from '../PhotoPreview';
import useMaintainRatio from '../../hooks/use-maintain-ratio';

function MissingPhoto({ isHidden }: { isHidden?: boolean }) {
  const ref = useMaintainRatio<HTMLDivElement>(4 / 3);

  return (
    <div ref={ref} className={styles.missingPhotoRatio}>
      <i className={isHidden ? 'fa fa-lock' : 'fa fa-image'} />
    </div>
  );
}

export default function PhotosList({
  photos,
  isHidden,
  numLocked,
}: {
  photos: string[];
  isHidden?: boolean;
  numLocked?: number;
}) {
  function renderPhoto(photo: string, index: number) {
    if (photo) {
      return (
        <div key={index} className={styles.photo}>
          <PhotoPreview photo={photo} alt="User" fullHeight />
        </div>
      );
    } else {
      return (
        <div key={index} className={styles.missingPhoto}>
          <MissingPhoto isHidden={isHidden} />
        </div>
      );
    }
  }

  const style = { gridTemplateColumns: photos.map(() => '1fr').join(' ') };

  return (
    <div className={styles.wrapper} style={style}>
      {photos.map(renderPhoto)}
      {!!numLocked && (
        <div className={styles.lockedBadge}>
          +{numLocked}
          <i className="fa fa-lock" />
        </div>
      )}
    </div>
  );
}
