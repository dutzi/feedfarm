import firebase from 'firebase/app'

import { impl as checkUsernameAvailabilityImpl } from './functions/check-username-availability';
import { impl as createFeedImpl } from './functions/create-feed';
import { impl as createGuestUserImpl } from './functions/create-guest-user';
import { impl as createUserPlaceholderImpl } from './functions/create-user-placeholder';
import { impl as createUserImpl } from './functions/create-user';
import { impl as deletePostImpl } from './functions/delete-post';
import { impl as getExtractImpl } from './functions/get-extract';
import { impl as getFeedIdImpl } from './functions/get-feed-id';
import { impl as getMyFeedsImpl } from './functions/get-my-feeds';
import { impl as getPollResultsImpl } from './functions/get-poll-results';
import { impl as getReactionAttributionsImpl } from './functions/get-reaction-attributions';
import { impl as logErrorImpl } from './functions/log-error';
import { impl as migrateUserImpl } from './functions/migrate-user';
import { impl as publishToFeedImpl } from './functions/publish-to-feed';
import { impl as requestLanguageImpl } from './functions/request-language';
import { impl as submitCommentImpl } from './functions/submit-comment';
import { impl as submitFeaturePriorityResponseImpl } from './functions/submit-feature-priority-response';
import { impl as submitPollAnswerImpl } from './functions/submit-poll-answer';
import { impl as toggleReactionImpl } from './functions/toggle-reaction';
import { impl as updateCurrentUserImpl } from './functions/update-current-user';
import { impl as updateFeedSettingsImpl } from './functions/update-feed-settings';

export async function checkUsernameAvailability(data?: Parameters<typeof checkUsernameAvailabilityImpl>[0]) {
  return (await firebase.functions().httpsCallable('checkUsernameAvailability')(data)).data as ReturnType<typeof checkUsernameAvailabilityImpl>;
}

export async function createFeed(data?: Parameters<typeof createFeedImpl>[0]) {
  return (await firebase.functions().httpsCallable('createFeed')(data)).data as ReturnType<typeof createFeedImpl>;
}

export async function createGuestUser(data?: Parameters<typeof createGuestUserImpl>[0]) {
  return (await firebase.functions().httpsCallable('createGuestUser')(data)).data as ReturnType<typeof createGuestUserImpl>;
}

export async function createUserPlaceholder(data?: Parameters<typeof createUserPlaceholderImpl>[0]) {
  return (await firebase.functions().httpsCallable('createUserPlaceholder')(data)).data as ReturnType<typeof createUserPlaceholderImpl>;
}

export async function createUser(data?: Parameters<typeof createUserImpl>[0]) {
  return (await firebase.functions().httpsCallable('createUser')(data)).data as ReturnType<typeof createUserImpl>;
}

export async function deletePost(data?: Parameters<typeof deletePostImpl>[0]) {
  return (await firebase.functions().httpsCallable('deletePost')(data)).data as ReturnType<typeof deletePostImpl>;
}

export async function getExtract(data?: Parameters<typeof getExtractImpl>[0]) {
  return (await firebase.functions().httpsCallable('getExtract')(data)).data as ReturnType<typeof getExtractImpl>;
}

export async function getFeedId(data?: Parameters<typeof getFeedIdImpl>[0]) {
  return (await firebase.functions().httpsCallable('getFeedId')(data)).data as ReturnType<typeof getFeedIdImpl>;
}

export async function getMyFeeds(data?: Parameters<typeof getMyFeedsImpl>[0]) {
  return (await firebase.functions().httpsCallable('getMyFeeds')(data)).data as ReturnType<typeof getMyFeedsImpl>;
}

export async function getPollResults(data?: Parameters<typeof getPollResultsImpl>[0]) {
  return (await firebase.functions().httpsCallable('getPollResults')(data)).data as ReturnType<typeof getPollResultsImpl>;
}

export async function getReactionAttributions(data?: Parameters<typeof getReactionAttributionsImpl>[0]) {
  return (await firebase.functions().httpsCallable('getReactionAttributions')(data)).data as ReturnType<typeof getReactionAttributionsImpl>;
}

export async function logError(data?: Parameters<typeof logErrorImpl>[0]) {
  return (await firebase.functions().httpsCallable('logError')(data)).data as ReturnType<typeof logErrorImpl>;
}

export async function migrateUser(data?: Parameters<typeof migrateUserImpl>[0]) {
  return (await firebase.functions().httpsCallable('migrateUser')(data)).data as ReturnType<typeof migrateUserImpl>;
}

export async function publishToFeed(data?: Parameters<typeof publishToFeedImpl>[0]) {
  return (await firebase.functions().httpsCallable('publishToFeed')(data)).data as ReturnType<typeof publishToFeedImpl>;
}

export async function requestLanguage(data?: Parameters<typeof requestLanguageImpl>[0]) {
  return (await firebase.functions().httpsCallable('requestLanguage')(data)).data as ReturnType<typeof requestLanguageImpl>;
}

export async function submitComment(data?: Parameters<typeof submitCommentImpl>[0]) {
  return (await firebase.functions().httpsCallable('submitComment')(data)).data as ReturnType<typeof submitCommentImpl>;
}

export async function submitFeaturePriorityResponse(data?: Parameters<typeof submitFeaturePriorityResponseImpl>[0]) {
  return (await firebase.functions().httpsCallable('submitFeaturePriorityResponse')(data)).data as ReturnType<typeof submitFeaturePriorityResponseImpl>;
}

export async function submitPollAnswer(data?: Parameters<typeof submitPollAnswerImpl>[0]) {
  return (await firebase.functions().httpsCallable('submitPollAnswer')(data)).data as ReturnType<typeof submitPollAnswerImpl>;
}

export async function toggleReaction(data?: Parameters<typeof toggleReactionImpl>[0]) {
  return (await firebase.functions().httpsCallable('toggleReaction')(data)).data as ReturnType<typeof toggleReactionImpl>;
}

export async function updateCurrentUser(data?: Parameters<typeof updateCurrentUserImpl>[0]) {
  return (await firebase.functions().httpsCallable('updateCurrentUser')(data)).data as ReturnType<typeof updateCurrentUserImpl>;
}

export async function updateFeedSettings(data?: Parameters<typeof updateFeedSettingsImpl>[0]) {
  return (await firebase.functions().httpsCallable('updateFeedSettings')(data)).data as ReturnType<typeof updateFeedSettingsImpl>;
}