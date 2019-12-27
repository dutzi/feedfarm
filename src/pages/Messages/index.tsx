import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import sortBy from 'lodash.sortby';
import firebase from 'firebase/app';
import cx from 'classnames';
import styles from './index.module.scss';
import { IChatPreview, IChatMessage } from '@feedfarm-shared/types';
import { IState } from '../../state/reducer';
import { useHistory } from 'react-router-dom';
import {
  sendMessage as sendMessageImpl,
  isAdmin,
  isRTLChar,
} from '../../utils';
import Spinner from '../../components/Spinner';
import useCallable from '../../hooks/use-callable';
import useViewProfileButton from '../../hooks/use-view-profile-button';
import Button from '../../components/Button';
import useCurrentUser from '../../hooks/use-current-user';
import useCurrentUserId from '../../hooks/use-current-user-id';
import useViewUserInDBButton from '../../hooks/use-view-user-in-db-button';
import useDeleteUserButton from '../../hooks/use-delete-user-button';
import useIsCurrentUserPremium from '../../hooks/use-is-current-user-premium';
import { getLocaleDate, groupMessages, getTime, onChatSnaphot } from './utils';
import { IGiphyGifRecord } from './partials/use-gif-selector';
import useGifSelector from './partials/use-gif-selector';
import useAddImage from './partials/use-add-image';
import { useTranslation, Trans } from 'react-i18next';
import useCurrentLanguage from '../../hooks/use-current-language';
import useContentSizer from '../../hooks/use-content-sizer';
import useIsMobile from '../../hooks/use-is-mobile';
import useIntersectionObserver from '@react-hook/intersection-observer';
import TextareaAutosize from 'react-autosize-textarea';
// import data from './data';

const Linkify = lazy(() => import('react-linkify'));

function renderLink(href: string, text: string, key: number) {
  return (
    <a
      key={key}
      className={styles.link}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      {text}
    </a>
  );
}

const getChatData = (sourceUid: string, targetUid: string) => (
  dispatch: any,
) => {
  return onChatSnaphot(sourceUid, targetUid, (chatData: IChatMessage[]) => {
    dispatch({ type: 'set-chat-data', payload: { chatData } });
    markChatAsRead(targetUid);
    // scrollChatToBottom();
  });
};

const sendMessageAction = (props: {
  message?: string;
  imageUrl?: string;
  targetUid: string;
  sourceUid: string;
}) => (dispatch: any) => {
  dispatch({
    type: 'add-new-sent-message',
    payload: {
      message: {
        from: props.sourceUid,
        message: props.message,
        imageUrl: props.imageUrl,
        read: false,
        timestamp: { seconds: Math.floor(new Date().getTime() / 1000) },
      } as IChatMessage,
    },
  });
  sendMessageImpl(props);
};

function markChatAsRead(id: string) {
  return firebase.functions().httpsCallable('markChatAsRead')({ id });
}

export default function Messages({ uid }: { uid: string }) {
  const dispatch = useDispatch();
  const activeChat = useSelector((state: IState) => state.chat.activeChat);
  const [limit, setLimit] = useState(400);
  const [chatsListShowMoreIO, chatsListShowMoreRef] = useIntersectionObserver();
  const [chatsList] = useCallable<IChatPreview[]>('getUsersIChatWith', {
    interval: 3000,
    data: { limit },
  });
  const [, setIsLoadingChat] = useState(false);
  const [showTestUsers, setShowTestUsers] = useState(false);
  const chatData = useSelector((state: IState) => state.chat.activeChatData);
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<any>(null);
  const renderViewProfileButton = useViewProfileButton(
    activeChat && activeChat.id,
  );
  const [currentUser] = useCurrentUser();
  const currentUserId = useCurrentUserId();
  const isCurrentUserAdmin = isAdmin(currentUserId);
  const isCurrentUserPremium = useIsCurrentUserPremium();
  const renderViewUserInDBButton = useViewUserInDBButton(
    activeChat && activeChat.id,
  );
  const [renderDeleteUserButton, renderDeleteUserModal] = useDeleteUserButton(
    activeChat && activeChat.id,
  );
  const [
    renderShowGifSelectorButton,
    renderGifSelector,
    isShowingGifSelector,
  ] = useGifSelector(message);
  const [renderAddImageButton, renderImagePreview] = useAddImage();
  const { isRtl } = useCurrentLanguage();
  const [wrapper] = useContentSizer({ setHeight: true });
  const history = useHistory();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  useEffect(() => {
    return history.listen(() => {
      dispatch({ type: 'clear-chat' });
    });
  }, []);

  useEffect(() => {
    if (activeChat) {
      setIsLoadingChat(true);

      messageInputRef.current!.focus();

      return dispatch<any>(getChatData(uid, activeChat.id));
    }
  }, [activeChat]);

  useEffect(() => {
    scrollChatToBottom();
  }, [chatData]);

  function scrollChatToBottom() {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight });
    }
  }

  // useEffect(() => {
  //   if (chatsList) {
  //     handleChatSelected(chatsList[0]);
  //   }
  // }, [chatsList]);

  function setActiveChat(chat?: IChatPreview) {
    dispatch({ type: 'set-active-chat', payload: { chat } });
  }

  function sendMessage(props: { message?: string; imageUrl?: string }) {
    if (activeChat) {
      dispatch(
        sendMessageAction({
          ...props,
          targetUid: activeChat.id,
          sourceUid: currentUserId,
        }),
      );
    }
  }

  function handleChatSelected(chat: IChatPreview) {
    setActiveChat(chat);
  }

  async function handleSendMessage() {
    if (!message.trim()) {
      return;
    }

    setMessage('');
    await sendMessage({ message });
  }

  const groupedChatMessages = groupMessages(chatData);

  function isFaved(id: string) {
    return false;
    // if (currentUser) {
    //   return currentUser.favorites.indexOf(id) !== -1;
    // }
  }

  function renderUserBadge(uid: string) {
    if (isAdmin(uid)) {
      return <i className="fa fa-shield"></i>;
    } else if (isFaved(uid)) {
      return <i className={cx('fa fa-heart', styles.favIcon)}></i>;
    }
  }

  const isShowAdminTools = currentUser && isCurrentUserAdmin;

  useEffect(() => {
    if (chatsListShowMoreIO.isIntersecting) {
      // setLimit(limit + 10);
      console.log({ limit });
    }
  }, [chatsListShowMoreIO]);

  function renderChatsList() {
    if (chatsList) {
      if (!isMobile || !activeChat) {
        const list = sortBy(
          chatsList,
          chat => chat.lastMessageTimestamp?._seconds,
        )
          .reverse()
          // const list = [...chatsList]
          //   .reverse()
          .filter(chat => showTestUsers || !chat.isTestUser)
          .map(chat => (
            <button
              className={cx(
                styles.chatListItem,
                activeChat && activeChat.id === chat.id && styles.active,
                chat.hasUnreadMessages && styles.hasUnread,
              )}
              key={chat.id}
              onClick={handleChatSelected.bind(null, chat)}
            >
              {chat.profilePhoto ? (
                <div className={styles.profilePhotoWrapper}>
                  <img
                    className={styles.profilePhoto}
                    src={chat.profilePhoto}
                    alt="User"
                  />
                  {chat.isOnline && isCurrentUserPremium && (
                    <div className={styles.onlineIndicator}></div>
                  )}
                </div>
              ) : (
                <div className={styles.noPhoto}>
                  <i className="fa fa-user" />
                  {chat.isOnline && isCurrentUserPremium && (
                    <div className={styles.onlineIndicator}></div>
                  )}
                </div>
              )}
              <div className="margin-v-sm" />
              <div className={styles.username}>{chat.username}</div>
              <div className={styles.flex1} />
              {renderUserBadge(chat.id)}
              {isCurrentUserAdmin && (
                <span className={styles.messageCount}>{chat.messageCount}</span>
              )}
            </button>
          ));

        return (
          <>
            {isCurrentUserAdmin && (
              <>
                <Button
                  label={
                    showTestUsers ? t('Hide Test Users') : t('Show Test Users')
                  }
                  fullWidth
                  variant="ghost"
                  onClick={handleToggleShowTestUser}
                />
                <div className="margin-h-md" />
              </>
            )}
            {list}
            <div ref={chatsListShowMoreRef as any} />
          </>
        );
      }
    } else {
      return <Spinner size="sm" />;
    }
  }

  function handleMobileBack() {
    setActiveChat(undefined);
  }

  function renderChatActions() {
    return (
      <div className={styles.actions}>
        {isMobile && (
          <Button
            variant="ghost"
            icon={`fa fa-chevron-${isRtl ? 'right' : 'left'}`}
            size="sm"
            label={t('Back')}
            onClick={handleMobileBack}
          />
        )}
        {renderViewProfileButton({ minimizeOnMobile: isShowAdminTools })}
        {isShowAdminTools && (
          <>
            {renderViewUserInDBButton({ minimizeOnMobile: true })}
            {renderDeleteUserButton({ minimizeOnMobile: true })}
          </>
        )}
      </div>
    );
  }

  function renderChatMessages() {
    return groupedChatMessages.map(messagesGroup => (
      <div key={messagesGroup.date} className={styles.messageGroup}>
        <div key="date" className={styles.date}>
          {getLocaleDate(messagesGroup.date)}
        </div>
        {messagesGroup.messages.map((message, index) => (
          <div
            key={index}
            className={cx(styles.message, message.from === uid && styles.mine)}
          >
            <div
              className={cx(
                styles.body,
                message.message && isRTLChar(message.message[0]) && styles.rtl,
                message.imageUrl && styles.gifMessage,
              )}
            >
              {message.message && (
                <Suspense fallback={message.message}>
                  <Linkify componentDecorator={renderLink}>
                    {message.message}
                  </Linkify>
                </Suspense>
              )}
              {message.imageUrl && (
                <img
                  className={styles.gif}
                  src={message.imageUrl}
                  onLoad={scrollChatToBottom}
                />
              )}
            </div>
            <div className={styles.metadata}>
              {message.from === currentUserId &&
                message.read &&
                currentUser &&
                isCurrentUserPremium && <i className="fa fa-check" />}
              {getTime(message.timestamp)}
              {message.isBeingSent && (
                <span className={styles.messageSpinnerWrapper}>
                  <Spinner size="x-sm" speed="slow" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    ));
  }

  function handleGifSelected(gif: IGiphyGifRecord) {
    setMessage('');
    sendMessage({ imageUrl: gif.full.url });
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }

  function handleToggleGifSelectorClick() {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }

  function handleSendImage(url: string) {
    sendMessage({ imageUrl: url });
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  function handleMessageKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function renderActiveChat() {
    let component: React.ReactElement | null, className: string | undefined;

    if (activeChat) {
      className =
        activeChat && isAdmin(activeChat.id)
          ? styles.onlyChat
          : styles.chatAndActions;

      component = (
        <>
          {renderChatActions()}
          <div className={styles.mainViewContainer}>
            <div className={styles.chat} ref={chatRef}>
              {renderChatMessages()}
            </div>
            {renderImagePreview({ onSend: handleSendImage })}
          </div>
          <div className={styles.messageComposer}>
            <div className={styles.textEditor}>
              <div className={styles.inputWrapper}>
                <TextareaAutosize
                  ref={messageInputRef}
                  placeholder={isShowingGifSelector ? t('Search For Gifs') : ''}
                  className={styles.textarea}
                  onKeyDown={handleMessageKeyDown}
                  value={message}
                  onChange={handleMessageChange}
                  autoFocus
                />
              </div>
              {renderShowGifSelectorButton({
                onClick: handleToggleGifSelectorClick,
              })}
              {renderAddImageButton()}
              <Button
                variant="ghost"
                label={t('Send')}
                onClick={handleSendMessage}
                disabled={!message}
              />
            </div>
            {renderGifSelector({ handleGifSelected })}
          </div>
        </>
      );
    } else {
      if (!isMobile) {
        className = styles.empty;
        component = (
          <div className={styles.emptyState}>
            <Trans i18nKey="message.emptyState">
              Select someone and start chatting
            </Trans>
          </div>
        );
      } else {
        component = null;
      }
    }

    return <div className={cx(styles.rightPane, className)}>{component}</div>;
  }

  function handleToggleShowTestUser() {
    setShowTestUsers(!showTestUsers);
  }

  return (
    <div ref={wrapper} className={styles.wrapper}>
      <div className={styles.leftPane}>{renderChatsList()}</div>
      {renderActiveChat()}
      {renderDeleteUserModal()}
    </div>
  );
}
