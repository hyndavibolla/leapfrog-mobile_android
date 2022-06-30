import { ENV } from '_constants';
import { IAction } from '_models/general';
import { ACTION_TYPE } from '_state_mgmt/core/actions';
import { ICoreState, initialState } from '_state_mgmt/core/state';

export const reducer = (state: ICoreState = initialState, { type, payload }: IAction): ICoreState => {
  switch (type) {
    case ACTION_TYPE.SET_IS_DEEP_LINK_LISTENER_READY:
      return { ...state, isDeepLinkListenerReady: payload.isDeepLinkListenerReady };
    case ACTION_TYPE.SET_IS_APP_READY:
      return { ...state, isAppReady: payload.isAppReady };
    case ACTION_TYPE.SET_IS_CONNECTED:
      return { ...state, isConnected: payload.isConnected };
    case ACTION_TYPE.ADD_TOAST:
      return { ...state, toastList: [...state.toastList, payload] };
    case ACTION_TYPE.REMOVE_TOAST:
      return { ...state, toastList: state.toastList.filter(item => item.key !== payload.key) };
    case ACTION_TYPE.ADD_MODAL:
      return { ...state, modalList: state.modalList.some(item => item.key === payload.key) ? state.modalList : [...state.modalList, payload] };
    case ACTION_TYPE.REMOVE_MODAL:
      return { ...state, modalList: state.modalList.filter(item => item.key !== payload.key) };
    case ACTION_TYPE.SET_DEEP_LINK:
      return { ...state, deepLink: payload.route && payload.params ? { route: payload.route, params: payload.params } : state.deepLink };
    case ACTION_TYPE.SET_LAST_ROUTE_KEY:
      return { ...state, lastRouteKey: payload.key ?? state.lastRouteKey };
    case ACTION_TYPE.SET_LAST_ROUTE_PARAMS:
      return { ...state, lastRouteParams: payload.params ?? state.lastRouteParams };
    case ACTION_TYPE.SET_ROUTE_HISTORY:
      return { ...state, routeHistory: [payload.route, ...state.routeHistory].slice(0, ENV.ROUTE_HISTORY_MAX_LENGTH) };
    case ACTION_TYPE.SET_HAS_SEEN_ONBOARDING:
      return { ...state, hasSeenOnboarding: payload.hasSeenOnboarding };
    case ACTION_TYPE.SET_VIEWED_TOOLTIP_LIST:
      return { ...state, viewedTooltipList: payload.list };
    case ACTION_TYPE.SET_DISMISSED_TOOLTIP_LIST:
      return { ...state, dismissedTooltipList: payload.list };
    case ACTION_TYPE.SET_HAS_SEEN_MISSION_MODAL:
      return { ...state, hasSeenMissionModal: payload.hasSeenMissionModal };
    case ACTION_TYPE.SET_EXPIRE_POINTS_BANNER_DATA_SET:
      return { ...state, expirePointsBannerDataSet: payload.dataSet };
    case ACTION_TYPE.SET_RZERO_USER_ID:
      return { ...state, roToken: payload.roToken };
    case ACTION_TYPE.SET_MARKETING_ID:
      return { ...state, marketingId: payload.marketingId };
    case ACTION_TYPE.SET_FORCED_UPDATE_SCREEN: {
      return { ...state, showForcedUpdateScreen: payload.showForcedUpdateScreen };
    }
    case ACTION_TYPE.SET_UPDATE_TUTORIAL:
      return { ...state, isTutorialVisible: payload.isTutorialVisible };
    case ACTION_TYPE.SET_TUTORIAL_AVAILABLE:
      return { ...state, isTutorialAvailable: payload.isTutorialAvailable };
    case ACTION_TYPE.SET_TUTORIAL_FROM:
      return { ...state, tutorialFrom: payload.tutorialFrom };
    case ACTION_TYPE.SET_EXPERIMENTS_CONFIG:
      return { ...state, experimentsConfig: payload.experimentsConfig };
    default:
      return state;
  }
};
