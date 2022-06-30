import React from 'react';
import { Platform } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

import { Deps, IGlobalState } from '_models/general';
import { MissionModel, OfferModel } from '_models';

import { getMockDeps } from '_test_utils/getMockDeps';
import { getMission_1, getMission_3 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getInitialState } from '_state_mgmt/GlobalState';

import { COLOR } from '_constants';

import { MissionDetail, Props } from './MissionDetail';

const mockedGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({ navigate: jest.fn(), goBack: mockedGoBack })
}));

describe('MissionDetail', () => {
  let deps: Deps;
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    Date.now = () => 1980;
    console.error = console.warn = () => null;
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      navigation: { goBack: jest.fn(), navigate: jest.fn() } as any,
      route: { params: { uuid: '12345' } }
    };
  });

  it('should not crash when the mission is not found', () => {
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />);
    expect(deps.logger.debug).not.toBeCalledWith('useGetMissionByBrandRequestorId', expect.anything());
    expect(getByTestId('mission-detail-empty-state')).toBeTruthy();
  });

  it('should render loading', () => {
    props.route.params.uuid = undefined;
    props.route.params.brandRequestorId = getMission_1().brandRequestorId;
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps);
    expect(getByTestId('mission-detail-skeleton-container')).toBeTruthy();
  });

  it('should render a mission with the point only per completion', () => {
    props.route.params.isAvailableStreakIndicator = true;
    const mission = { '12345': { ...getMission_3() } };
    const state = { ...initialState, mission: { ...initialState.mission, missionMap: mission } };
    const { getAllByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, state);
    expect(getAllByTestId('pill-text')[0]).toHaveStyle({ color: COLOR.PRIMARY_BLUE });
  });

  it('should render a mission without terms and conditions', () => {
    const mission = getMission_3();
    mission.termsAndConditions = null;
    initialState.mission.missionMap = { ['12345']: mission };
    const { queryByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    expect(queryByTestId('mission-detail-terms-and-conditions')).toBeFalsy();
  });

  it('should have a shop button pressable', () => {
    const mission = { ...getMission_1(), pubRef: 'fakePubRef' };
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-shop-btn'));
    expect(deps.nativeHelperService.buttonSdk.purchaseRequest).toBeCalledWith(
      getMission_1().callToActionUrl,
      getMission_1().offerId,
      'fakePubRef',
      expect.any(Function)
    );
  });

  it('should have a shop button pressable without pubRef', () => {
    const mission = getMission_1();
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-shop-btn'));
    expect(deps.nativeHelperService.buttonSdk.purchaseRequest).toBeCalledWith(getMission_1().callToActionUrl, getMission_1().offerId, '', expect.any(Function));
  });

  it('should have a shop button pressable that warns on errors', () => {
    const mission = getMission_1();
    initialState.mission.missionMap = { ['12345']: mission };
    deps.nativeHelperService.buttonSdk.purchaseRequest = (_, _2, _3, fn) => fn('request', null, 'error');
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-shop-btn'));
    expect(deps.logger.error).toBeCalledWith('request', expect.any(Object));
    expect(deps.logger.debug).toBeCalledWith('showToast', expect.any(Object));
  });

  it('should have a shop button pressable that warns with null callToActionUrl', () => {
    const mission = { ...getMission_1(), callToActionUrl: null };
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-shop-btn'));
    expect(deps.nativeHelperService.buttonSdk.purchaseRequest).not.toBeCalled();
    expect(deps.logger.warn).toBeCalledWith(expect.any(String), { mission });
  });

  it('should go back in history navigation when go back button is pressed', () => {
    const mission = getMission_1();
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('back-button-default'));
    expect(mockedGoBack).toBeCalled();
  });

  it('should render a mission without brandCategories field received', () => {
    const mission = { ...getMission_3(), brandCategories: undefined };
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState, () => initialState);
    expect(getByTestId('mission-detail-brand-name')).toHaveTextContent(mission.brandName);
  });

  it('should show the post purchase modal', async () => {
    const mission = getMission_1();
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId, findByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-shop-btn'));
    expect(await findByTestId('mission-detail-purchase-modal')).toBeTruthy();
  });

  it('should dismiss the purchase modal', async () => {
    const mission = getMission_1();
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId, queryByTestId, findByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-shop-btn'));
    fireEvent.press(await findByTestId('mission-detail-purchase-accept-btn'));
    expect(queryByTestId('mission-detail-purchase-modal')).toBeFalsy();
  });

  it('should not show nested offers if not available', () => {
    const mission = getMission_3();
    mission.pointsAwarded.conditions = [
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 1000,
        category: 'category-b',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      }
    ];
    initialState.mission.missionMap = { ['12345']: mission };
    const { queryByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    expect(queryByTestId('mission-detail-nested-offers')).toBeFalsy();
  });

  it('should show nested offers without the see more link', () => {
    const mission = getMission_3();
    mission.pointsAwarded.conditions = [
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 1000,
        category: 'category-b',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 1000,
        category: 'category-a',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 2000,
        category: 'category-c',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      }
    ];
    initialState.mission.missionMap = { ['12345']: mission };
    const { queryByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    expect(queryByTestId('mission-detail-see-more-offers-btn')).toBeNull();
  });

  it('should warn when multiple nested offers category is empty', () => {
    const mission = getMission_3();
    mission.pointsAwarded.conditions = [
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 1000,
        category: '',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 1000,
        category: '',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      }
    ];
    initialState.mission.missionMap = { ['12345']: mission };
    renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    expect(deps.logger.warn).toBeCalledWith(expect.any(String), { offerId: mission.offerId, mission });
  });

  it('should show and hide nested offers modal', () => {
    const mission = getMission_3();
    mission.pointsAwarded.conditions = [
      {
        rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR,
        rewardValue: 10,
        category: 'category-a',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 1000,
        category: 'category-b',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.FIXED_POINTS,
        rewardValue: 2000,
        category: 'category-c',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR,
        rewardValue: 15,
        category: '',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.PERCENT_OFF,
        rewardValue: 5,
        category: 'category-d',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      },
      {
        rewardType: MissionModel.RedemptionType.POINT_PER_DOLLAR,
        rewardValue: 0,
        category: 'category-f',
        programType: OfferModel.ProgramType.STREAK,
        programSubType: 'mission'
      }
    ];
    initialState.mission.missionMap = { ['12345']: mission };
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    fireEvent.press(getByTestId('mission-detail-see-more-offers-btn'));
    expect(getByTestId('mission-detail-nested-offers-modal')).toBeTruthy();
    fireEvent.press(getByTestId('mission-detail-nested-offers-cancel-btn'));
    expect(queryByTestId('mission-detail-nested-offers-modal')).toBeFalsy();
    fireEvent.press(getByTestId('mission-detail-see-more-offers-btn'));
    fireEvent.press(getByTestId('modal-backdrop'));
  });

  it('should show border top on Android', () => {
    const mission = getMission_1();
    Platform.OS = 'android';
    initialState.mission.missionMap = { ['12345']: mission };
    const { queryByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    expect(queryByTestId('mission-detail-footer-border')).toBeTruthy();
  });

  it('should not show border top on iOS', () => {
    const mission = getMission_1();
    Platform.OS = 'ios';
    initialState.mission.missionMap = { ['12345']: mission };
    const { queryByTestId } = renderWithGlobalContext(<MissionDetail {...props} />, deps, initialState);
    expect(queryByTestId('mission-detail-footer-border')).toBeFalsy();
  });
});
