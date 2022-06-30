import { Props as ModalProps } from '_components/Modal';
import { Props as ToastProps } from '_components/Toast';
import { IExpirePointsBannerDataSet, TooltipKey } from '_models/general';

export enum ACTION_TYPE {
  SET_IS_DEEP_LINK_LISTENER_READY = '[core] set is deep link listener ready',
  SET_IS_APP_READY = '[core] set is app ready',
  SET_IS_CONNECTED = '[core] set is connected',
  ADD_TOAST = '[core] add toast',
  REMOVE_TOAST = '[core] remove toast',
  ADD_MODAL = '[core] add modal',
  REMOVE_MODAL = '[core] remove modal',
  SET_DEEP_LINK = '[core] set deep link',
  SET_LAST_ROUTE_KEY = '[core] set last route key',
  SET_LAST_ROUTE_PARAMS = '[core] set last route params',
  SET_ROUTE_HISTORY = '[core] set route history',
  SET_HAS_SEEN_ONBOARDING = '[core] set has seen onboarding',
  SET_VIEWED_TOOLTIP_LIST = '[core] set viewed tooltip list',
  SET_DISMISSED_TOOLTIP_LIST = '[core] set dismissed tooltip list',
  SET_HAS_SEEN_MISSION_MODAL = '[core] set has seen mission modal',
  SET_EXPIRE_POINTS_BANNER_DATA_SET = '[core] set expire points banner data set',
  SET_RZERO_USER_ID = '[core] set rzero user id',
  SET_MARKETING_ID = '[core] set marketing id',
  SET_FORCED_UPDATE_SCREEN = '[core] set force update screen',
  SET_UPDATE_TUTORIAL = '[core] set show tutorial',
  SET_TUTORIAL_AVAILABLE = '[core] set tutorial available',
  SET_TUTORIAL_FROM = '[core] set tutorial from',
  SET_EXPERIMENTS_CONFIG = '[core] set experiments config'
}

export const actions = {
  setIsDeepLinkListenerReady: (isDeepLinkListenerReady: boolean) => ({
    type: ACTION_TYPE.SET_IS_DEEP_LINK_LISTENER_READY,
    payload: { isDeepLinkListenerReady }
  }),
  setIsAppReady: (isAppReady: boolean) => ({ type: ACTION_TYPE.SET_IS_APP_READY, payload: { isAppReady } }),
  setIsConnected: (isConnected: boolean) => ({ type: ACTION_TYPE.SET_IS_CONNECTED, payload: { isConnected } }),
  addToast: (key: string, props: ToastProps) => ({ type: ACTION_TYPE.ADD_TOAST, payload: { key, props } }),
  removeToast: (key: string) => ({ type: ACTION_TYPE.REMOVE_TOAST, payload: { key } }),
  addModal: (key: string, props: ModalProps) => ({ type: ACTION_TYPE.ADD_MODAL, payload: { key, props } }),
  removeModal: (key: string) => ({ type: ACTION_TYPE.REMOVE_MODAL, payload: { key } }),
  setDeepLink: (route: string, params: Object) => ({ type: ACTION_TYPE.SET_DEEP_LINK, payload: { route, params } }),
  setLastRouteKey: (key: string) => ({ type: ACTION_TYPE.SET_LAST_ROUTE_KEY, payload: { key } }),
  setLastRouteParams: (params: object) => ({ type: ACTION_TYPE.SET_LAST_ROUTE_PARAMS, payload: { params } }),
  pushIntoRouteHistory: (route: string) => ({ type: ACTION_TYPE.SET_ROUTE_HISTORY, payload: { route } }),
  setHasSeenOnboarding: (hasSeenOnboarding: boolean) => ({ type: ACTION_TYPE.SET_HAS_SEEN_ONBOARDING, payload: { hasSeenOnboarding } }),
  setViewedTooltipList: (list: TooltipKey[]) => ({ type: ACTION_TYPE.SET_VIEWED_TOOLTIP_LIST, payload: { list } }),
  setDismissedTooltipList: (list: TooltipKey[]) => ({ type: ACTION_TYPE.SET_DISMISSED_TOOLTIP_LIST, payload: { list } }),
  setHasSeenMissionModal: (hasSeenMissionModal: boolean) => ({
    type: ACTION_TYPE.SET_HAS_SEEN_MISSION_MODAL,
    payload: { hasSeenMissionModal }
  }),
  setExpirePointsBannerDataSet: (dataSet: IExpirePointsBannerDataSet) => ({ type: ACTION_TYPE.SET_EXPIRE_POINTS_BANNER_DATA_SET, payload: { dataSet } }),
  setRzeroToken: (roToken: string) => ({ type: ACTION_TYPE.SET_RZERO_USER_ID, payload: { roToken } }),
  setMarketingId: (marketingId: string) => ({ type: ACTION_TYPE.SET_MARKETING_ID, payload: { marketingId } }),
  setForcedUpdateScreen: (showForcedUpdateScreen: boolean) => ({ type: ACTION_TYPE.SET_FORCED_UPDATE_SCREEN, payload: { showForcedUpdateScreen } }),
  showTutorial: (isTutorialVisible: boolean) => ({ type: ACTION_TYPE.SET_UPDATE_TUTORIAL, payload: { isTutorialVisible } }),
  setTutorialAvailable: (isTutorialAvailable: boolean) => ({ type: ACTION_TYPE.SET_TUTORIAL_AVAILABLE, payload: { isTutorialAvailable } }),
  setTutorialFrom: (tutorialFrom: string) => ({ type: ACTION_TYPE.SET_TUTORIAL_FROM, payload: { tutorialFrom } }),
  setExperimentsConfig: (experimentsConfig: Object) => ({ type: ACTION_TYPE.SET_EXPERIMENTS_CONFIG, payload: { experimentsConfig } })
};
