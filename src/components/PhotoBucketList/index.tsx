import React from 'react';
// import styles from './index.module.scss';
import PhotoBucket from '../PhotoBucket';
import times from 'lodash.times';

export default function PhotoBucketList({
  value,
  length,
  onChange,
}: {
  value: string[];
  length: number;
  onChange: (files: string[]) => void;
}) {
  function handleChange(index: number, url: string) {
    const newValue = value ? [...value] : times(length, _ => '');
    newValue[index] = url;
    onChange(newValue);
  }

  return (
    <React.Fragment>
      {times(length).map(index => (
        <PhotoBucket
          key={index}
          onChange={handleChange.bind(null, index)}
          value={value[index]}
        />
      ))}
    </React.Fragment>
  );
}
