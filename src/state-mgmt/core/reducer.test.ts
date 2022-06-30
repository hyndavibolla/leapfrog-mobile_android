import { reducer } from './reducer';
import { initialState } from './state';
import { actions } from './actions';
import { TooltipKey } from '../../models/general';
import { ENV } from '_constants/env';

describe('core reducer', () => {
  it('should return the previous state when no switch case matches', () => {
    expect(reducer(undefined, { type: null, payload: null })).toBe(initialState);
  });

  it('should return a new state ACTION_TYPE.SET_IS_CONNECTED', () => {
    expect(reducer(initialState, actions.setIsConnected(false))).toEqual({ ...initialState, isConnected: false });
  });

  it('should return a new state ACTION_TYPE.ADD_TOAST', () => {
    expect(reducer(initialState, actions.addToast('a', { title: 'hi' }))).toEqual({ ...initialState, toastList: [{ key: 'a', props: { title: 'hi' } }] });
  });

  it('should return a new state ACTION_TYPE.REMOVE_TOAST', () => {
    expect(
      reducer(
        {
          ...initialState,
          toastList: [
            { key: 'a', props: { title: 'hi' } },
            { key: 'b', props: { title: 'hi2' } }
          ]
        },
        actions.removeToast('a')
      )
    ).toEqual({ ...initialState, toastList: [{ key: 'b', props: { title: 'hi2' } }] });
  });

  it('should return a new state ACTION_TYPE.ADD_MODAL', () => {
    expect(reducer(initialState, actions.addModal('b', { children: 'b' }))).toEqual({ ...initialState, modalList: [{ key: 'b', props: { children: 'b' } }] });
    expect(
      reducer(
        {
          ...initialState,
          modalList: [
            { key: 'a', props: { children: 'a' } },
            { key: 'b', props: { children: 'b' } }
          ]
        },
        actions.addModal('b', { children: 'b' })
      )
    ).toEqual({
      ...initialState,
      modalList: [
        { key: 'a', props: { children: 'a' } },
        { key: 'b', props: { children: 'b' } }
      ]
    });
  });

  it('should return a new state ACTION_TYPE.REMOVE_MODAL', () => {
    expect(
      reducer(
        {
          ...initialState,
          modalList: [
            { key: 'a', props: { children: 'a' } },
            { key: 'b', props: { children: 'b' } }
          ]
        },
        actions.removeModal('a')
      )
    ).toEqual({ ...initialState, modalList: [{ key: 'b', props: { children: 'b' } }] });
  });

  it('should return a new state ACTION_TYPE.SET_LAST_ROUTE_KEY', () => {
    expect(reducer({ ...initialState }, actions.setLastRouteKey('key'))).toEqual({ ...initialState, lastRouteKey: 'key' });
    expect(reducer({ ...initialState, lastRouteKey: 'default' }, actions.setLastRouteKey(null))).toEqual({ ...initialState, lastRouteKey: 'default' });
  });

  it('should return a new state ACTION_TYPE.SET_DEEP_LINK', () => {
    expect(reducer({ ...initialState }, actions.setDeepLink(`${ENV.SCHEME}earn/offer`, { brandRequestorId: 'UBER' }))).toEqual({
      ...initialState,
      deepLink: { route: `${ENV.SCHEME}earn/offer`, params: { brandRequestorId: 'UBER' } }
    });
    expect(
      reducer({ ...initialState, deepLink: { route: `${ENV.SCHEME}earn/offer`, params: { brandRequestorId: 'UBER' } } }, actions.setDeepLink(null, null))
    ).toEqual({
      ...initialState,
      deepLink: { route: `${ENV.SCHEME}earn/offer`, params: { brandRequestorId: 'UBER' } }
    });
  });

  it('should return a new state ACTION_TYPE.SET_ROUTE_HISTORY', () => {
    expect(reducer({ ...initialState, routeHistory: ['a', 'b'] }, actions.pushIntoRouteHistory('z'))).toEqual({
      ...initialState,
      routeHistory: ['z', 'a', 'b']
    });
  });

  it('should return a new state ACTION_TYPE.SET_HAS_SEEN_ONBOARDING', () => {
    expect(reducer({ ...initialState }, actions.setHasSeenOnboarding(true))).toEqual({ ...initialState, hasSeenOnboarding: true });
  });

  it('should return a new state ACTION_TYPE.SET_VIEWED_TOOLTIP_LIST', () => {
    expect(reducer({ ...initialState }, actions.setViewedTooltipList([TooltipKey.EARN]))).toEqual({ ...initialState, viewedTooltipList: [TooltipKey.EARN] });
  });

  it('should return a new state ACTION_TYPE.SET_DISMISSED_TOOLTIP_LIST', () => {
    expect(reducer({ ...initialState }, actions.setDismissedTooltipList([TooltipKey.EARN]))).toEqual({
      ...initialState,
      dismissedTooltipList: [TooltipKey.EARN]
    });
  });

  it('should return a new state ACTION_TYPE.SET_EXPIRE_POINTS_BANNER_DATA_SET', () => {
    expect(reducer({ ...initialState }, actions.setExpirePointsBannerDataSet({ lastPointsDate: 5, lastAcceptedDate: 6 }))).toEqual({
      ...initialState,
      expirePointsBannerDataSet: { lastPointsDate: 5, lastAcceptedDate: 6 }
    });
  });

  it('should return a new state ACTION_TYPE.SET_TUTORIAL_AVAILABLE', () => {
    expect(reducer(initialState, actions.setTutorialAvailable(true))).toEqual({ ...initialState, isTutorialAvailable: true });
  });
});
