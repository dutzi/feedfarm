import React from 'react';
import paneStyles from '../index.module.scss';
import useCurrentLanguage from '../../../../hooks/use-current-language';

type TPaneTypes = 'main' | 'style';

export default function BackButton({ onClick }: { onClick: () => void }) {
  const { isRtl } = useCurrentLanguage();

  return (
    <button className={paneStyles.backButton} onClick={onClick}>
      <i className={`fa fa-chevron-${isRtl ? 'right' : 'left'}`} />
    </button>
  );
}
