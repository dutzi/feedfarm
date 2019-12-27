import { IUser, IPublicUser } from '@feedfarm-shared/types';

export interface IState {
  currentUser: IUser | undefined;
  impersonatedUser?: IUser | IPublicUser;
  isLoading: boolean;
}

const currentUserInitialState: IState = {
  currentUser: undefined,
  isLoading: true,
};

export type TAction =
  | {
      type: 'set-current-user';
      payload: {
        currentUser: IUser | undefined;
      };
    }
  | {
      type: 'update-current-user';
      payload: { currentUser: Partial<IUser> };
    }
  | {
      type: 'impersonate';
      payload: {
        user: IUser | IPublicUser;
      };
    };

export const reducer = (
  state = currentUserInitialState,
  action: TAction,
): IState => {
  switch (action.type) {
    case 'set-current-user':
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
      };
    case 'update-current-user':
      if (state.currentUser) {
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            ...action.payload.currentUser,
          },
        };
      } else {
        // shuold never get here
        console.error(
          'trying to dispatch update-current-user before dispatching set-current-user',
        );
        return {
          ...state,
          currentUser: {
            ...(action.payload.currentUser as IUser),
          },
        };
      }
    case 'impersonate':
      return { ...state, impersonatedUser: action.payload.user };
    default:
      return state;
  }
};
