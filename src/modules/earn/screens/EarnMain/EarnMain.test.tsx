import React from 'react';
import { ScrollView, Animated, NativeEventSubscription } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
const { RESULTS } = require('react-native-permissions/mock');

import { ENV, ROUTES, TealiumEventType, UxObject } from '_constants';
import { EarnSections, EarnSectionsData } from '_modules/earn/screens/EarnMain/constants';
import { Deps, FeatureFlag, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { MissionListType } from '_models/mission';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';

import { getLinkedCards_2, getLocalOffers_1, getMission_1, getMission_2 } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getStateSnapshotStorage } from '_utils/getStateSnapshotStorage';
import { noop } from '_utils/noop';
import EarnMain, { Props } from './EarnMain';

const position = {
  coords: {
    latitude: 57.7,
    longitude: 11.93
  }
};

describe('EarnMain', () => {
  let props: Props;
  let deps: Deps;
  let render;
  let initialState: IGlobalState;

  beforeEach(() => {
    Date.now = () => 1980;
    initialState = getInitialState();
    jest.spyOn(Animated, 'ScrollView' as any, 'get').mockReturnValue(ScrollView);

    props = {
      navigation: {
        navigate: jest.fn(),
        isFocused: jest.fn(() => true),
        push: jest.fn(),
        setParams: jest.fn()
      } as any,
      route: { params: {} }
    };
    deps = getMockDeps();
    deps.remoteConfigService.getValue = jest.fn().mockReturnValueOnce(undefined);
    deps.remoteConfigService.getImmediateValue = jest.fn().mockReturnValueOnce(EarnSectionsData.sections);
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(RESULTS.GRANTED);
    const { Screen, Navigator } = createStackNavigator();
    render = (p, d, s) => {
      const Component = () => <EarnMain {...props} {...(p || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        d,
        s
      );
    };
  });

  it('should render loading', async () => {
    const { findByTestId } = render(props, deps, initialState);

    expect(await findByTestId('earn-main-skeleton-container')).toBeTruthy();
  });

  it('should render with a critical error', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockRejectedValueOnce('error');
    const { findByTestId } = render(props, deps, initialState);

    expect(await findByTestId('earn-main-skeleton-container')).toBeTruthy();
  });

  it('should not render active missions section if empty', async () => {
    const mission = getMission_1();
    deps.apiService.fetchMissionList = jest.fn().mockImplementation(({ listType }) => ({
      userId: 'buttonId',
      missions: listType === KnownMissionSearchKey.DYNAMIC_LIST_2 ? [] : [mission],
      listType
    }));
    const { queryByTestId } = render(props, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('earn-main-streak-section')).toBeNull();
    });
  });

  it('should render without streaks', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValueOnce([]);
    const { queryByTestId, queryAllByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(queryByTestId('earn-main-streak-header')).toBeNull();
      expect(queryAllByTestId('large-streak-card-container')).toHaveLength(0);
    });
  });

  it('should render with error of streak list', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockRejectedValueOnce('error');
    const { findByTestId } = render(props, deps, initialState);
    expect(await findByTestId('section-error-component')).toBeTruthy();
  });

  it('should render with streaks', async () => {
    const { queryByTestId, queryAllByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(queryByTestId('earn-main-featured-missions-streak-header')).toBeTruthy();
      expect(queryAllByTestId('large-streak-card-container').length).toBeGreaterThan(0);
    });
  });

  it('should render with data', async () => {
    deps.apiService.fetchMissionList = jest.fn().mockImplementationOnce(({ listType }) => ({
      userId: 'buttonId',
      missions: Array.from(new Array(60)).map((_, index) => ({
        ...getMission_1(),
        uuid: String(index)
      })),
      listType
    }));

    const { toJSON } = render(props, deps, initialState);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should scroll to map card section', async () => {
    deps.apiService.fetchMissionList = async ({ listType }) => ({
      userId: 'buttonId',
      missions: Array.from(new Array(60)).map((_, index) => ({ ...getMission_1(), uuid: String(index) })),
      listType
    });

    props.route.params.scrollToSection = 'mapCardSection';
    const { toJSON, getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      fireEvent(getByTestId('earn-main-find-offers-map-section-container'), 'layout', {
        nativeEvent: {
          layout: {
            y: 1200
          }
        }
      });
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render after horizontal scrolling', async () => {
    const { toJSON, getAllByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      fireEvent(getAllByTestId('earn-main-list-section-horizontal-scroll')[0], 'scroll', {
        nativeEvent: {
          contentOffset: {
            x: 80
          },
          contentSize: {
            width: 500
          },
          layoutMeasurement: {
            width: 500
          }
        }
      });
      fireEvent(getAllByTestId('earn-main-list-section-horizontal-scroll')[0], 'momentumScrollEnd');
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should navigate to webview when a CPA banner was pressed', async () => {
    const mission = getMission_1();
    deps.apiService.fetchMissionList = async ({ listType }) => ({
      userId: 'buttonId',
      missions: [mission],
      listType
    });
    const { getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(getByTestId('cpa-mission-card-container')).toBeTruthy();
      fireEvent.press(getByTestId('cpa-mission-card-container'));
    });

    expect(deps.eventTrackerService.tealiumSDK.track).toHaveBeenCalledWith(
      TealiumEventType.SELECT_MISSION,
      expect.objectContaining({
        uxObject: UxObject.TILE,
        event_type: 'cpa_banner',
        event_detail: JSON.stringify({ url: mission.callToActionUrl })
      })
    );

    expect(props.navigation.navigate).toBeCalledWith(ROUTES.COMMON_WEB_VIEW.MAIN, {
      title: mission.brandName,
      url: mission.callToActionUrl
    });
  });

  it('should refresh data by default', async () => {
    initialState.core.routeHistory = [ROUTES.MAIN_TAB.EARN, ROUTES.MAIN_TAB.WALLET];
    render(props, deps, initialState);
    await waitFor(() => expect(deps.apiService.fetchStreakList).toBeCalledTimes(1));
  });

  it('should NOT refresh data when navigating from certain routes', async () => {
    initialState.core.routeHistory = [ROUTES.MAIN_TAB.EARN, ROUTES.MISSION_DETAIL, ROUTES.MAIN_TAB.EARN];
    render(props, deps, initialState);
    await waitFor(() => expect(deps.apiService.fetchStreakList).toBeCalledTimes(0));
  });

  it('should render without new on max cards', async () => {
    deps.nativeHelperService.sailthru.getMessages = jest.fn().mockResolvedValue([]);
    const { queryAllByTestId } = render(props, deps, initialState);
    await waitFor(() => {
      expect(queryAllByTestId('new-on-max-card-container')).toHaveLength(0);
    });
  });

  it('should mark a new on max card as read when it is closed', async () => {
    const { findAllByTestId } = render(props, deps, initialState);
    fireEvent.press((await findAllByTestId('new-on-max-card-close-btn'))[1]);
    expect(deps.nativeHelperService.sailthru.markMessageAsRead).toBeCalled();
  });

  it('should show toast when map card was pressed and location permission is granted', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock)
      .mockReturnValueOnce(RESULTS.DENIED)
      .mockReturnValueOnce(RESULTS.DENIED)
      .mockReturnValueOnce(RESULTS.GRANTED);
    (deps.nativeHelperService.reactNativePermission.request as jest.Mock).mockReturnValueOnce(RESULTS.GRANTED);

    const { getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      fireEvent.press(getByTestId('map-card-button'));
    });

    expect(deps.logger.debug).toBeCalledWith('showToast', expect.anything());
  });

  it('should not show toast when map card was pressed and location permission is denied', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(RESULTS.DENIED);
    (deps.nativeHelperService.reactNativePermission.request as jest.Mock).mockReturnValueOnce(RESULTS.DENIED);
    const { getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      fireEvent.press(getByTestId('map-card-button'));
    });
    expect(deps.logger.debug).not.toBeCalledWith('showToast', expect.anything());
  });

  it('should update the location permission status when app comes back from background or foreground', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    deps.stateSnapshot = getStateSnapshotStorage();
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(RESULTS.DENIED).mockReturnValueOnce(RESULTS.GRANTED);
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    const { findByTestId } = render(props, deps, initialState);
    expect(await findByTestId('map-card-button-text')).toHaveTextContent('Find places near you');
  });

  it('should show in-store offers and then show and call edit button zip code', async () => {
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(RESULTS.DENIED);
    initialState.user.currentUser.personal.currentLocation = { zip: 33101, latitude: position.coords.latitude, longitude: position.coords.longitude };
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;

    const { findByTestId } = render(props, deps, initialState);
    expect(await findByTestId('map-card-button-edit-zip-code')).toBeTruthy();
  });

  it('should show in-store offers when show me offer button is pressed', async () => {
    initialState.cardLink.linkedCardsList = [getLinkedCards_2()];
    deps.apiService.fetchLinkedCardsList = jest.fn().mockResolvedValue({ linkedCards: [getLinkedCards_2()] });
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(RESULTS.GRANTED);
    (deps.nativeHelperService.geolocation.getCurrentPosition as jest.Mock).mockImplementationOnce(successCallback => {
      successCallback(position);
    });
    deps.apiService.fetchLocalOffers = jest.fn().mockResolvedValue(getLocalOffers_1()) as any;
    const { getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      fireEvent.press(getByTestId('banner-add-cards-button-show-offers'));
      expect(deps.nativeHelperService.storage.set).toBeCalledWith(ENV.STORAGE_KEY.SHOW_OFFERS_ON_EARN_MAIN, true);
    });
  });

  it('should render new on max component if its defined on the remote config', async () => {
    const remoteConfig = [
      {
        name: EarnSections.NEW_ON_MAX,
        order: 0,
        visible: true,
        title: 'New on MAX',
        description: '',
        seeAllButton: true
      }
    ];
    deps.remoteConfigService.getImmediateValue = (() => remoteConfig) as any;
    const { findByTestId } = render(props, deps, initialState);
    expect(await findByTestId('earn-main-new-on-max-container')).toBeTruthy();
  });

  it('should not render top brands component if its not defined on the remote config', async () => {
    const remoteConfig = [
      {
        name: EarnSections.NEW_ON_MAX,
        order: 0,
        visible: true,
        title: 'New on MAX',
        description: '',
        seeAllButton: true
      }
    ];
    deps.remoteConfigService.getImmediateValue = (() => remoteConfig) as any;
    const { queryByTestId } = render(props, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('earn-main-top-brands-section-container')).toBeNull();
    });
  });

  it('should not render components that does not exists in the defined componentsSections', async () => {
    const remoteConfig = [
      {
        name: 'fakeComponent',
        order: 0,
        visible: true,
        title: 'Fake Component',
        description: '',
        seeAllButton: true
      }
    ];
    deps.remoteConfigService.getImmediateValue = (() => remoteConfig) as any;
    const { queryByTestId } = render(props, deps, initialState);
    await waitFor(() => {
      expect(queryByTestId('earn-main-new-on-max-container')).toBeNull();
      expect(queryByTestId('earn-main-top-brands-section-container')).toBeNull();
      expect(queryByTestId('earn-main-list-list-6-section-container')).toBeNull();
      expect(queryByTestId('earn-main-list-list-2-section-container')).toBeNull();
      expect(queryByTestId('earn-main-top-categories-container')).toBeNull();
      expect(queryByTestId('earn-main-top-brands-section-container')).toBeNull();
      expect(queryByTestId('earn-main-surveys-container')).toBeNull();
      expect(queryByTestId('earn-main-featured-missions-container')).toBeNull();
      expect(queryByTestId('earn-main-claim-your-rewards-container')).toBeNull();
      expect(queryByTestId('earn-main-find-offers-map-section-container')).toBeNull();
      expect(queryByTestId('earn-main-recently-missions-section-container')).toBeNull();
    });
  });

  it('should navigate to top brands mission detail page', async () => {
    initialState.mission = {
      ...initialState.mission,
      isButtonInit: true,
      buttonUserId: '1234'
    };

    const { findAllByTestId } = render(props, deps, initialState);

    const missionList = await findAllByTestId('medium-mission-card-container');
    fireEvent.press(missionList[0]);
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_DETAIL, expect.any(Object));
  });

  it('should render tutorial banner and call skip button', async () => {
    initialState.core.isTutorialAvailable = true;
    initialState.cardLink.linkedCardsList = [getLinkedCards_2()];
    initialState.cardLink.offers = getLocalOffers_1().offers;
    initialState.cardLink.hasCalledLocalOffer = true;
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValueOnce(RESULTS.GRANTED);

    const status = {
      isBannerWatched: false,
      date: undefined
    };
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(status);

    deps.apiService.fetchMissionList = async ({ listType }) => ({
      userId: 'buttonId',
      missions: Array.from(new Array(10)).map((_, index) => ({ ...getMission_1(), uuid: String(index) })),
      listType
    });

    const { getByTestId, queryByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(getByTestId('welcome-tutorial-banner-skip-button')).toBeTruthy();
    });

    await act(async () => fireEvent.press(getByTestId('welcome-tutorial-banner-skip-button')));

    expect(queryByTestId('welcome-tutorial-banner-container')).toBeNull();
    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, expect.any(Object));
  });

  it('should open tutorial from profile and call skip tutorial', async () => {
    props.route.params.isShowTutorial = true;
    const { getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(getByTestId('tutorial-button-skip')).toBeTruthy();
    });

    await act(async () => fireEvent.press(getByTestId('tutorial-button-skip')));

    expect(deps.nativeHelperService.storage.set).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, expect.any(Object));
  });

  it('should be hidden the tutorial banner', async () => {
    initialState.core.isTutorialAvailable = true;
    props.route.params = undefined;
    const status = {
      isBannerWatched: true,
      date: undefined
    };
    deps.nativeHelperService.storage.get = jest.fn().mockResolvedValue(status);
    const { queryByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(deps.nativeHelperService.storage.get).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);
      expect(queryByTestId('welcome-tutorial-banner')).toBeNull();
    });
  });

  it('should hide the tutorial banner when it is not available', async () => {
    initialState.core.isTutorialAvailable = true;
    const { queryByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      expect(deps.nativeHelperService.storage.get).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);
      expect(queryByTestId('welcome-tutorial-banner')).toBeNull();
    });
  });

  it('should open tutorial when is called from profile', async () => {
    props.route.params.isShowTutorial = true;
    const { getByTestId, toJSON } = render(props, deps, initialState);
    await waitFor(() => {
      expect(deps.nativeHelperService.storage.get).toHaveBeenCalledWith(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);
      expect(getByTestId('tutorial-modal')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  /** @todo test should go through all steps of tutorial and get the congrats animation */
  // it('should open tutorial and call tutorial end', async () => {
  //   props.route.params.isShowTutorial = true;
  //   const { getByTestId, getAllByTestId } = render(props, deps, initialState);
  //   await waitFor(async () => {
  //     expect(getByTestId('tutorial-modal')).toBeTruthy();
  //     fireEvent(getAllByTestId('view-tutorial-view')[0], 'onLayout', { nativeEvent: { layout: { x: 100, y: 100 } } });
  //     fireEvent.press(getByTestId('tutorial-button-next'));
  //     expect(getByTestId('tutorial-congrats-banner-container')).toBeTruthy();
  //   });
  //   waitForElementToBeRemoved(() => getByTestId('tutorial-congrats-banner-container'));
  // });

  it('should navigate to search results when a search is focused', async () => {
    ENV.IGNORED_FEATURE_LIST.splice(ENV.IGNORED_FEATURE_LIST.indexOf(FeatureFlag.MISSIONS_SEARCH), 1);
    const { getByTestId } = render(props, deps, initialState);

    await waitFor(() => {
      fireEvent.changeText(getByTestId('search-input-input'), 'something');
      fireEvent(getByTestId('search-input-input'), 'focus');
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.MISSION_SEE_ALL, {
        missionListType: MissionListType.DEFAULT,
        searchKey: KnownMissionSearchKey.SEE_ALL,
        isMainSearchFromEarnPage: true
      });
    });
  });

  it('should navigate to recently viewed mission detail page', async () => {
    initialState.mission = {
      ...initialState.mission,
      recentlyViewedMissions: [getMission_2()]
    };

    const { findAllByTestId } = render(props, deps, initialState);
    const list = await findAllByTestId('medium-mission-card-container');
    fireEvent.press(list[0]);
    expect(props.navigation.navigate).toBeCalledWith(
      ROUTES.MISSION_DETAIL,
      expect.objectContaining({ brandRequestorId: getMission_2().brandRequestorId, isAvailableStreakIndicator: expect.any(Boolean) })
    );
  });
});
