import { ADMIN_UID } from './../utils/index';
import { TSupportedLanguages, TFeatureType } from '@feedfarm-shared/types';
export type TAction =
  | {
      type: 'open-profile';
      payload: {
        uid: string;
      };
    }
  | {
      type: 'open-gallery';
      payload: {
        photoUrl: string;
      };
    }
  | {
      type: 'close-gallery';
    }
  | {
      type: 'close-profile';
    }
  | {
      type: 'set-footer-el';
      payload: { footerEl: HTMLDivElement };
    }
  | {
      type: 'set-header-el';
      payload: { headerEl: HTMLDivElement };
    }
  | {
      type: 'open-signup-modal';
    }
  | {
      type: 'close-signup-modal';
    }
  | {
      type: 'set-language';
      payload: { language: TSupportedLanguages };
    }
  | {
      type: 'show-priority-feedback-modal';
      payload: { featureType: TFeatureType };
    }
  | {
      type: 'hide-priority-feedback-modal';
    };

export interface IState {
  profileUid: string | undefined;
  gallery?: { isOpen: boolean; photoUrl?: string };
  footerEl?: HTMLDivElement;
  headerEl?: HTMLDivElement;
  showSignupModal?: boolean;
  language?: TSupportedLanguages;
  priorityFeedbackModal: {
    show: boolean;
    featureType?: TFeatureType;
  };
}

const initialState: IState = {
  profileUid: undefined,
  priorityFeedbackModal: {
    show: false,
  },
};

export const reducer = (state = initialState, action: TAction): IState => {
  switch (action.type) {
    case 'open-profile':
      if (action.payload.uid === ADMIN_UID) {
        return state;
      }

      return { ...state, profileUid: action.payload.uid };
    case 'open-gallery':
      return {
        ...state,
        gallery: { isOpen: true, photoUrl: action.payload.photoUrl },
      };
    case 'close-gallery':
      return {
        ...state,
        gallery: { isOpen: false },
      };
    case 'close-profile':
      return { ...state, profileUid: undefined };
    case 'set-header-el':
      return { ...state, headerEl: action.payload.headerEl };
    case 'set-footer-el':
      return { ...state, footerEl: action.payload.footerEl };
    case 'open-signup-modal':
      return { ...state, showSignupModal: true };
    case 'close-signup-modal':
      return { ...state, showSignupModal: false };
    case 'set-language':
      return { ...state, language: action.payload.language };
    case 'show-priority-feedback-modal':
      return {
        ...state,
        priorityFeedbackModal: {
          show: true,
          featureType: action.payload.featureType,
        },
      };
    case 'hide-priority-feedback-modal':
      return {
        ...state,
        priorityFeedbackModal: {
          show: false,
        },
      };
    default:
      return state;
  }
};
