import { IFeed, TFeedThemeType, IBasicUser } from '@feedfarm-shared/types';
import { useTypedSelector } from './reducer';

export type TAction =
  | {
      type: 'set-feed';
      payload: { feed: IFeed };
    }
  | {
      type: 'set-feed-theme';
      payload: { theme: TFeedThemeType };
    }
  | {
      type: 'set-feed-rules';
      payload: Pick<
        IFeed,
        | 'allowsCommenting'
        | 'allowsReactions'
        | 'allowsTags'
        | 'whoCanRead'
        | 'whoCanWrite'
      >;
    }
  | {
      type: 'add-feed-owner';
      payload: { user: IBasicUser };
    }
  | {
      type: 'add-feed-moderator';
      payload: { user: IBasicUser };
    }
  | {
      type: 'add-feed-member';
      payload: { user: IBasicUser };
    }
  | {
      type: 'add-feed-banned-user';
      payload: { user: IBasicUser };
    }
  | {
      type: 'remove-feed-owner';
      payload: { uid: string };
    }
  | {
      type: 'remove-feed-moderator';
      payload: { uid: string };
    }
  | {
      type: 'remove-feed-member';
      payload: { uid: string };
    }
  | {
      type: 'remove-feed-banned-user';
      payload: { uid: string };
    }
  | {
      type: 'set-feed-name';
      payload: { name: string };
    }
  | {
      type: 'saved-changes';
    }
  | {
      type: 'set-feed-is-private';
    };

export interface IState {
  feed?: IFeed;
  hasUnsavedChanges: boolean;
  isPrivate?: boolean;
}

const initialState: IState = {
  hasUnsavedChanges: false,
};

function removeUID(list: IBasicUser[] | undefined, uid: string) {
  if (!list) {
    return [];
  }

  const newList = [...list];
  newList.splice(
    list.findIndex(user => user.uid === uid),
    1,
  );

  return newList;
}

function deriveCanReadUIDS(feed: IFeed) {
  if (feed.whoCanRead === 'member') {
    return feed.members
      .map(member => member.uid)
      .concat(feed.moderators.map(moderator => moderator.uid))
      .concat(feed.owners.map(owner => owner.uid));
  }

  return [];
}

export const reducer = (state = initialState, action: TAction): IState => {
  let newFeed: IFeed;

  switch (action.type) {
    case 'set-feed':
      return { ...state, feed: action.payload.feed };
    case 'set-feed-theme':
      return {
        ...state,
        feed: { ...state.feed!, theme: action.payload.theme },
        hasUnsavedChanges: true,
      };
    case 'set-feed-rules':
      newFeed = { ...state.feed!, ...action.payload };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'remove-feed-owner':
      newFeed = {
        ...state.feed!,
        owners: removeUID(state.feed?.owners, action.payload.uid),
      };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'remove-feed-moderator':
      newFeed = {
        ...state.feed!,
        moderators: removeUID(state.feed?.moderators, action.payload.uid),
      };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'remove-feed-member':
      newFeed = {
        ...state.feed!,
        members: removeUID(state.feed?.members, action.payload.uid),
      };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'remove-feed-banned-user':
      return {
        ...state,
        feed: {
          ...state.feed!,
          bannedUsers: removeUID(state.feed?.bannedUsers, action.payload.uid),
        },
        hasUnsavedChanges: true,
      };
    case 'add-feed-owner':
      newFeed = {
        ...state.feed!,
        owners: [...state.feed?.owners, action.payload.user],
      };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'add-feed-moderator':
      newFeed = {
        ...state.feed!,
        moderators: [...state.feed?.moderators, action.payload.user],
      };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'add-feed-member':
      newFeed = {
        ...state.feed!,
        members: [...state.feed?.members, action.payload.user],
      };
      newFeed.canReadUIDS = deriveCanReadUIDS(newFeed);

      return {
        ...state,
        feed: newFeed,
        hasUnsavedChanges: true,
      };
    case 'add-feed-banned-user':
      return {
        ...state,
        feed: {
          ...state.feed!,
          bannedUsers: [...state.feed?.bannedUsers, action.payload.user],
        },
        hasUnsavedChanges: true,
      };
    case 'saved-changes':
      return {
        ...state,
        hasUnsavedChanges: false,
      };
    case 'set-feed-name':
      return {
        ...state,
        feed: {
          ...state.feed!,
          name: action.payload.name,
        },
      };
    case 'set-feed-is-private':
      return {
        ...state,
        isPrivate: true,
      };
    default:
      return state;
  }
};

export function useIsFeedPrivate() {
  return useTypedSelector(state => state.feed.isPrivate);
}
