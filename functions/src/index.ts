import * as admin from 'firebase-admin';

admin.initializeApp();

// import addToPastebin from './functions/add-to-pastebin';
// import removeFromPastebin from './functions/remove-from-pastebin';
// import findMatches from './functions/find-matches';
import getExtract from './functions/get-extract';
// import sendMessage from './functions/send-message';
// import hasUnreadMessages from './functions/has-unread-messages';
// import getUsersIChatWith from './functions/get-users-i-chat-with';
// import markChatAsRead from './functions/mark-chat-as-read';
// import sendHiddenPhotosRequest from './functions/send-hidden-photos-request';
// import cancelHiddenPhotosRequest from './functions/cancel-hidden-photos-request';
// import getNotifications from './functions/get-notifications';
// import markNotificationAsRead from './functions/mark-notification-as-read';
// import respondToPhotosRequest from './functions/respond-to-photos-request';
// import getProfile from './functions/get-profile';
// import markAllNotificationsAsRead from './functions/mark-all-notifications-as-read';
import createUser from './functions/create-user';
// import getMatchInfo from './functions/get-match-info';
import checkUsernameAvailability from './functions/check-username-availability';
// import setUserTags from './functions/set-user-tags';
// import getSampleVideo from './functions/get-sample-video';
// import reactToVideo from './functions/react-to-video';
// import generateEmail from './functions/generate-email';
import logError from './functions/log-error';
// import revealView from './functions/reveal-view';
import updateCurrentUser from './functions/update-current-user';
import requestLanguage from './functions/request-language';
// import getUserTags from './functions/get-user-tags';
// import addToLibrary from './functions/add-to-library';
import submitComment from './functions/submit-comment';
import publishToFeed from './functions/publish-to-feed';
import toggleReaction from './functions/toggle-reaction';
import getReactionAttributions from './functions/get-reaction-attributions';
import deletePost from './functions/delete-post';
import createFeed from './functions/create-feed';
import createGuestUser from './functions/create-guest-user';
import submitPollAnswer from './functions/submit-poll-answer';
import getPollResults from './functions/get-poll-results';
import createUserPlaceholder from './functions/create-user-placeholder';
import updateFeedSettings from './functions/update-feed-settings';
import migrateUser from './functions/migrate-user';
import getFeedId from './functions/get-feed-id';
import submitFeaturePriorityResponse from './functions/submit-feature-priority-response';
import getMyFeeds from './functions/get-my-feeds';

export {
  getExtract,
  // addToPastebin,
  // removeFromPastebin,
  // findMatches,
  // sendMessage,
  // hasUnreadMessages,
  // getUsersIChatWith,
  // markChatAsRead,
  // sendHiddenPhotosRequest,
  // cancelHiddenPhotosRequest,
  // getNotifications,
  // markNotificationAsRead,
  // respondToPhotosRequest,
  // getProfile,
  // markAllNotificationsAsRead,
  createUser,
  // getMatchInfo,
  checkUsernameAvailability,
  // setUserTags,
  // getSampleVideo,
  // reactToVideo,
  // generateEmail,
  logError,
  // revealView,
  updateCurrentUser,
  requestLanguage,
  // getUserTags,
  // addToLibrary,
  submitComment,
  publishToFeed,
  toggleReaction,
  getReactionAttributions,
  deletePost,
  createFeed,
  createGuestUser,
  submitPollAnswer,
  getPollResults,
  createUserPlaceholder,
  updateFeedSettings,
  migrateUser,
  getFeedId,
  submitFeaturePriorityResponse,
  getMyFeeds,
};
