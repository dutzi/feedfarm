import React from 'react';
import styles from './index.module.scss';
import Modal from '../Modal';
import Button from '../Button';

export default function MessageBox({
  show,
  onClose,
  buttons,
  buttonKeys,
  title,
  body,
  backdropClickClose = true,
}: {
  show: boolean;
  onClose: (response?: string) => void;
  buttons: string[];
  buttonKeys: string[];
  title: string;
  body: string;
  backdropClickClose?: boolean;
}) {
  return (
    <Modal
      show={show}
      onClose={onClose}
      backdropClickClose={backdropClickClose}
    >
      <div className={styles.wrapper}>
        <div className={styles.title}>{title}</div>
        <div className={styles.body}>{body}</div>
        <div className={styles.actions}>
          <div />
          {buttons.map((label, index) => (
            <Button
              variant="ghost"
              key={label}
              label={label}
              onClick={onClose.bind(null, buttonKeys[index])}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
