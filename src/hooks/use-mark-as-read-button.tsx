import React, { useState } from 'react';
import firebase from 'firebase/app';
import Button from '../components/Button';
import { INotification } from '@feedfarm-shared/types';

export default function useMarkAsReadButton(notification: INotification) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRead, setIsRead] = useState(notification.read);

  async function handleClick() {
    setIsProcessing(true);
    await firebase.functions().httpsCallable('markNotificationAsRead')({
      id: notification.id,
    });
    setIsRead(true);
    setIsProcessing(false);
  }

  function render() {
    if (isRead) {
      return null;
    }

    return (
      <Button
        label="Mark As Read"
        variant="ghost"
        size="sm"
        onClick={handleClick}
        showSpinner={isProcessing}
      />
    );
  }

  return render;
}
