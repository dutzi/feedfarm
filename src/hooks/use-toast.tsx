import React, { useState, useRef } from 'react';
import Toast from '../components/Toast';

export default function useToast(): [
  (mesage: string) => void,
  (callback: () => void) => void,
  () => React.ReactElement,
] {
  const [isShowToast, setIsShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const undoHandler = useRef<any>(null);
  const toastMessageTimeout = useRef<any>(null);

  function showToast(message: string) {
    setIsShowToast(true);
    setToastMessage(message);
    clearTimeout(toastMessageTimeout.current);
    toastMessageTimeout.current = setTimeout(() => {
      setIsShowToast(false);
    }, 8000);
  }

  function setUndoHandler(handler: () => void) {
    undoHandler.current = handler;
  }

  function handleUndo() {
    setIsShowToast(false);
    if (undoHandler.current) {
      undoHandler.current();
    }
  }

  function renderToast() {
    return (
      <Toast show={isShowToast} message={toastMessage} onUndo={handleUndo} />
    );
  }

  return [showToast, setUndoHandler, renderToast];
}
