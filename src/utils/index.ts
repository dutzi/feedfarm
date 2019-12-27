import firebase from 'firebase/app';
import sha1 from 'sha1';
import uuidv1 from 'uuid/v1';
import { IUser, IFeed } from '@feedfarm-shared/types';

import { pascalCase } from 'change-case';
import { useRef } from 'react';

export function hashAsset(url: string) {
  return sha1(url);
}

export function parseTags(tags: string) {
  return tags.trim().length === 0
    ? []
    : tags
        .split(' ')
        .filter(tag => tag.trim() !== '')
        .map(parseTag);
}

export function parseTag(tag: string) {
  tag = tag.trim();
  return tag.startsWith('#') ? tag.substring(1) : tag;
}

export function padArray(arr: any[], len: number, fill: any) {
  return arr.concat(Array(len).fill(fill)).slice(0, len);
}

export async function sendMessage({
  message,
  imageUrl,
  targetUid,
}: {
  message?: string;
  imageUrl?: string;
  targetUid: string;
}) {
  const sendMessage = firebase.functions().httpsCallable('sendMessage');

  return await sendMessage({ message, imageUrl, targetUid });
}

export function isDoc(path: string) {
  if (path.startsWith('/')) {
    return path.split('/').length % 2 === 1;
  } else {
    return path.split('/').length % 2 === 0;
  }
}

export function getProfilePhoto(photos: string[]) {
  return photos.filter(photo => !!photo)[0];
}

export const ADMIN_UID = 'peNEXtLHb0VkYNWe1lGkwQ1Jo0C3';
export const ADMIN_USERNAME = 'dutzi';

var ltrChars =
  'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
  '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF';
var rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';
var rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');

export function isRTLChar(char: string) {
  return rtlDirCheck.test(char);
}

export function isAdmin(id: string) {
  return id === ADMIN_UID;
}

export function uploadFile(file: File) {
  var storageRef = firebase.storage().ref();
  var imageRef = storageRef.child(
    `user-photos/thumbnails/${uuidv1()}_200x200.jpg`,
  );

  return imageRef.put(file).then(function(snapshot) {
    return snapshot.ref.getDownloadURL();
  });
}

export function trackEvent(
  action: string,
  {
    category,
    label,
    value,
  }: { category: string; label: string; value: number },
) {
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export function getColor(photo: string) {
  switch (photo.split('-')[0].substr(1)) {
    case 'carrot':
      return '#E15241';
    case 'pink':
      return '#D63964';
    case 'purple':
      return '#8F36AA';
    case 'indigo':
      return '#4253AF';
    case 'aqua':
      return '#4AA8EE';
    case 'turquoise':
      return '#419488';
    case 'green':
      return '#67AC5B';
    case 'lime':
      return '#97C05C';
    case 'yellow':
      return '#D0DA59';
    case 'apricot':
      return '#F6C244';
    case 'orange':
      return '#F19C38';
    case 'cherry': // todo change to tiger
      return '#EC6337';
    case 'brown':
      return '#74564A';
    case 'gray':
      return '#9E9E9E';
    case 'pigeon':
      return '#667D89';
    default:
      return 'black';
  }
}

export function getEmoji(photo: string) {
  return photo.split('-')[1];
}

export function getUsername(photo: string) {
  return pascalCase(photo);
}

export function getUserRoles(feed?: IFeed, user?: IUser) {
  return {
    owner: !!feed?.owners.find(owner => owner.uid === user?.id),
    moderator: !!feed?.moderators.find(moderator => moderator.uid === user?.id),
    member: !!feed?.members.find(member => member.uid === user?.id),
    bannedUser: !!feed?.bannedUsers.find(
      bannedUser => bannedUser.uid === user?.id,
    ),
  };
}

export function canUserWrite(feed?: IFeed, user?: IUser) {
  const userRoles = getUserRoles(feed, user);

  return (
    feed?.whoCanWrite === 'guest' ||
    (feed?.whoCanWrite === 'member' && userRoles.member) ||
    userRoles.owner ||
    userRoles.moderator
  );
}

export function useAnimationRef<T extends HTMLElement = HTMLDivElement>() {
  return useRef<T>(null);
}
