import { Props as ModalProps } from '_components/Modal';
import { Props as ToastProps } from '_components/Toast';
import { IExpirePointsBannerDataSet, TooltipKey } from '_models/general';

export interface ICoreState {
  isDeepLinkListenerReady: boolean;
  isAppReady: boolean;
  isConnected: boolean;
  toastList: { key: string; props: ToastProps }[];
  modalList: { key: string; props: ModalProps }[];
  deepLink: { route: string; params: Object };
  lastRouteKey: string;
  lastRouteParams: object;
  routeHistory: string[];
  hasSeenOnboarding: boolean;
  viewedTooltipList: TooltipKey[];
  dismissedTooltipList: TooltipKey[];
  hasSeenMissionModal: boolean;
  expirePointsBannerDataSet: IExpirePointsBannerDataSet;
  roToken: string;
  marketingId: string;
  showForcedUpdateScreen: boolean;
  isTutorialVisible: boolean;
  isTutorialAvailable: boolean;
  tutorialFrom: string;
  experimentsConfig: object;
}

export const initialState: ICoreState = {
  isDeepLinkListenerReady: false,
  isAppReady: false,
  isConnected: true,
  toastList: [],
  modalList: [],
  deepLink: null,
  lastRouteKey: null,
  lastRouteParams: undefined,
  routeHistory: [],
  hasSeenOnboarding: null,
  viewedTooltipList: [],
  dismissedTooltipList: [],
  hasSeenMissionModal: false,
  expirePointsBannerDataSet: { lastAcceptedDate: 0, lastPointsDate: 0 },
  roToken: null,
  marketingId: undefined,
  showForcedUpdateScreen: false,
  isTutorialVisible: false,
  isTutorialAvailable: false,
  tutorialFrom: '',
  experimentsConfig: {}
};
