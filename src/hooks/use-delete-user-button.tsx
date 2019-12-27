import React, { useState } from 'react';
import { isAdmin } from '../utils';
import firebase from 'firebase/app';
import Button from '../components/Button';
import useProcessing from './use-processing';
import useCurrentUserId from './use-current-user-id';
import MessageBox from '../components/MessageBox';

export default function useDeleteUserButton(uid?: string) {
  const currentUserId = useCurrentUserId();
  const processing = useProcessing();
  const [showModal, setShowModal] = useState(false);

  async function handleDeleteUser() {
    setShowModal(true);
  }

  async function deleteUser() {
    processing.start();

    if (uid) {
      const allChats = await firebase
        .firestore()
        .collection(`/chats`)
        .get();

      const userChats = allChats.docs.filter(doc => doc.id.indexOf(uid) > -1);

      await Promise.all(
        userChats.map(chat => {
          return firebase
            .firestore()
            .doc(`/chats/${chat.id}`)
            .delete();
        }),
      );

      await firebase
        .firestore()
        .doc(`/users/${uid}`)
        .delete();

      // TODO delete all sub collections
    }

    processing.stop();
  }

  function render({ minimizeOnMobile }: { minimizeOnMobile?: boolean } = {}) {
    return null;

    if (!isAdmin(currentUserId)) {
      return null;
    }

    return (
      <Button
        icon="fa fa-user-times"
        label="Delete User"
        variant="ghost"
        size="sm"
        onClick={handleDeleteUser}
        showSpinner={processing.state}
        minimizeOnMobile={minimizeOnMobile}
      />
    );
  }

  function handleCloseModal(response?: string) {
    setShowModal(false);
    if (response === 'Ok') {
      deleteUser();
    }
  }

  function renderModal() {
    return (
      <MessageBox
        show={showModal}
        onClose={handleCloseModal}
        buttons={['Cancel', 'Ok']}
        buttonKeys={['cancel', 'ok']}
        title="Are you sure that want to delete this user?"
        body="This action cannot be undone"
      />
    );
  }

  return [render, renderModal];
}
