import { IChatMessage, IChatPreview } from '@feedfarm-shared/types';

export type TAction =
  | {
      type: 'set-chat-data';
      payload: {
        chatData: IChatMessage[];
      };
    }
  | {
      type: 'set-active-chat';
      payload: {
        chat: IChatPreview;
      };
    }
  | {
      type: 'add-new-sent-message';
      payload: {
        message: IChatMessage;
      };
    }
  | {
      type: 'clear-chat';
    };

export interface IState {
  activeChatData: IChatMessage[];
  activeChat?: IChatPreview;
}

const initialState: IState = {
  activeChatData: [],
};

export const reducer = (state = initialState, action: TAction): IState => {
  switch (action.type) {
    case 'set-chat-data':
      return { ...state, activeChatData: action.payload.chatData };
    case 'set-active-chat':
      return { ...state, activeChat: action.payload.chat };
    case 'add-new-sent-message':
      return {
        ...state,
        activeChatData: [
          ...state.activeChatData,
          { ...action.payload.message, isBeingSent: true },
        ],
      };
    case 'clear-chat':
      return {
        ...state,
        activeChat: undefined,
        activeChatData: [],
      };
    default:
      return state;
  }
};
