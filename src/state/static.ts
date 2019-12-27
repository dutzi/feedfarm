export type TAction = {
  type: 'set-uuid';
  payload: { uuid: string };
};

export interface IState {
  uuid?: string;
}

const initialState: IState = {};

export const reducer = (state = initialState, action: TAction): IState => {
  switch (action.type) {
    case 'set-uuid':
      return { ...state, uuid: action.payload.uuid };
    default:
      return state;
  }
};
