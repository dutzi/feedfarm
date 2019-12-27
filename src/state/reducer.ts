import { combineReducers } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import * as UI from './ui';
import * as Chat from './chat';
import * as CurrentUser from './current-user';
import * as Static from './static';
import * as Feed from './feed';
import { useCallback } from 'react';

export interface IState {
  currentUser: CurrentUser.IState;
  chat: Chat.IState;
  ui: UI.IState;
  static: Static.IState;
  feed: Feed.IState;
}

export type TAction =
  | UI.TAction
  | Chat.TAction
  | CurrentUser.TAction
  | Static.TAction
  | Feed.TAction;

const rootReducer = combineReducers({
  ui: UI.reducer,
  chat: Chat.reducer,
  currentUser: CurrentUser.reducer,
  static: Static.reducer,
  feed: Feed.reducer,
});

export function useTypedDispatch() {
  const dispatch = useDispatch();

  const typedDispatch = useCallback((action: TAction) => dispatch(action), [
    dispatch,
  ]);

  return typedDispatch;
}

export function useTypedSelector<T>(selector: (state: IState) => T) {
  return useSelector(selector);
}

export default rootReducer;
