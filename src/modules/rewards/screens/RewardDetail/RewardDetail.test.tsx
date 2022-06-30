import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { getRewardConfig_1, getSlideBrand_1, getUser } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { RewardModel } from '_models';
import { listToMap } from '_utils/listToMap';
import { IGlobalState } from '_models/general';
import { ENV } from '_constants';
import { getMockDeps } from '_test_utils/getMockDeps';
import { EmailStatus } from '_models/user';
import { getInitialState } from '_state_mgmt/GlobalState';

import RewardDetail, { Props } from './RewardDetail';

const mockedGoBack = jest.fn();

jest.mock('@react-navigation/core', () => ({
  __esModule: true,
  useRoute: () => null,
  getFocusedRouteNameFromRoute: () => null
}));

jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useFocusEffect: fn => fn(),
  useNavigation: () => ({ navigate: jest.fn(), goBack: mockedGoBack })
}));

describe('RewardDetail', () => {
  let props: Props;
  let state: IGlobalState;

  beforeEach(() => {
    const ignoredFeatures = ENV.IGNORED_FEATURE_LIST;
    state = getInitialState();
    props = {
      navigation: { goBack: jest.fn(), navigate: jest.fn() } as any,
      route: { params: { brandId: getSlideBrand_1().id } }
    };
    state = {
      ...state,
      reward: {
        ...state.reward,
        slideObjectMapByType: { ...state.reward.slideObjectMapByType, [RewardModel.SlideObjectType.BRAND]: listToMap([getSlideBrand_1()]) }
      },
      game: {
        ...state.game,
        current: {
          ...state.game.current,
          balance: { ...state.game.current.balance, availablePoints: 1500 },
          missions: { ...state.game.current.missions, pointsPerCent: 10 }
        }
      }
    };
    ENV.IGNORED_FEATURE_LIST = ignoredFeatures;
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render loading', async () => {
    props.route.params.brandId = undefined;
    props.route.params.brandName = getSlideBrand_1().brandName;
    const { findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />);
    expect(await findByTestId('reward-detail-skeleton-container')).toBeTruthy();
  });

  it('should not crash when the reward is not found', async () => {
    props.route.params.brandId = 'brand-id-not-found';
    const { findByTestId, deps, getByTestId } = renderWithGlobalContext(<RewardDetail {...props} />);
    expect(deps.logger.debug).not.toBeCalledWith('useRewardConfigBrandSearch');
    expect(await findByTestId('reward-detail-empty-state-container')).toBeTruthy();
    fireEvent.press(getByTestId('reward-detail-empty-state-close-btn'));
    expect(props.navigation.navigate).toBeCalled();
  });

  it('should render with limits from the config api', async () => {
    state = {
      ...state,
      reward: {
        ...state.reward,
        config: {
          ...getRewardConfig_1()
        }
      }
    };
    const { toJSON } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render with less options than the max and disabled free selection', async () => {
    state = {
      ...state,
      reward: {
        ...state.reward,
        config: {
          ...state.reward.config,
          limits: {
            maxAmount: 10,
            minAmount: 1,
            duration: 'daily'
          }
        },
        slideObjectMapByType: {
          ...state.reward.slideObjectMapByType,
          [RewardModel.SlideObjectType.BRAND]: listToMap([
            {
              ...getSlideBrand_1(),
              cardValueConfig: { increment: 3, maxValue: 10, minValue: 1, variableLoadSupported: false, denominations: [100, 500, 1000, 1500] }
            }
          ])
        }
      }
    };
    const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    await waitFor(() => {
      expect(queryByTestId('gift-card-input-input')).toBeNull();
      expect(getAllByTestId('gift-card-input-option')).toHaveLength(3); // should have only 3 options
    });
  });

  it('should render with denominations if available when free selection is disabled', async () => {
    state = {
      ...state,
      reward: {
        ...state.reward,
        config: {
          ...state.reward.config,
          limits: {
            maxAmount: 150,
            minAmount: 15,
            duration: 'daily'
          }
        },
        slideObjectMapByType: {
          ...state.reward.slideObjectMapByType,
          [RewardModel.SlideObjectType.BRAND]: listToMap([
            {
              ...getSlideBrand_1(),
              cardValueConfig: { increment: 3, maxValue: 150, minValue: 15, variableLoadSupported: false, denominations: [1500, 7500, 15000] }
            }
          ])
        }
      }
    };
    const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    await waitFor(() => {
      expect(queryByTestId('gift-card-input-input')).toBeNull();
      expect(getAllByTestId('gift-card-input-option-value')[0].children[1]).toBe('15');
      expect(getAllByTestId('gift-card-input-option-value')[1].children[1]).toBe('75');
      expect(getAllByTestId('gift-card-input-option-value')[2].children[1]).toBe('150');
    });
  });

  it('should render without description, legalTerms and disclaimer', async () => {
    state = {
      ...state,
      reward: {
        ...state.reward,
        slideObjectMapByType: {
          ...state.reward.slideObjectMapByType,
          [RewardModel.SlideObjectType.BRAND]: listToMap([
            { ...getSlideBrand_1(), legalTerms: '', description: '', redemptionConfigs: { ...getSlideBrand_1().redemptionConfigs, disclaimer: '' } }
          ])
        }
      }
    };
    const { queryByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-description')).toBeNull();
      expect(queryByTestId('gift-card-detail-disclaimer')).toBeNull();
      expect(queryByTestId('gift-card-detail-legal-terms')).toBeNull();
    });
  });

  it('should render without data', async () => {
    const { toJSON } = renderWithGlobalContext(<RewardDetail {...props} />);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should go back in history navigation when go back button is pressed', async () => {
    const { findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    fireEvent.press(await findByTestId('back-button-default'));
    expect(mockedGoBack).toBeCalled();
  });

  it('should navigate to checkout gift card view when the button redeem is pressed', async () => {
    state.game.current.balance.availablePoints = 10;
    state.reward.config.limits = { maxAmount: 10, minAmount: 1, duration: 'daily' };
    const { findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    fireEvent.press(await findByTestId('gift-card-detail-redeem-btn'));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String), expect.any(Object));
  });

  it('should try to navigate to checkout gift card', async () => {
    state.game.current.balance.availablePoints = 10;
    state.reward.config.limits = { maxAmount: 10, minAmount: 1, duration: 'daily' };
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    state.reward.slideObjectMapByType[RewardModel.SlideObjectType.BRAND] = listToMap([
      {
        ...getSlideBrand_1(),
        cardValueConfig: { increment: 3, maxValue: 10, minValue: 1, variableLoadSupported: false, denominations: [100, 500, 1000, 1500] }
      }
    ]);
    const { findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    fireEvent.press(await findByTestId('gift-card-detail-redeem-btn'));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String), expect.any(Object));
  });

  it('should NOT navigate to checkout when card value is invalid and instead render feedback', async () => {
    (state.reward.slideObjectMapByType[RewardModel.SlideObjectType.BRAND][getSlideBrand_1().id] as RewardModel.IBrand).redemptionConfigs.methods = [];
    const { getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    fireEvent.changeText(await findByTestId('gift-card-input-input'), '1');
    fireEvent.press(getByTestId('gift-card-detail-redeem-btn'));
    expect(props.navigation.navigate).not.toBeCalled();
    expect(getByTestId('gift-card-input-error-label')).toBeTruthy();
  });

  it('should not display email validation warning if email is approved', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.APPROVED;
    const deps = getMockDeps();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.APPROVED });
    const { queryByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, undefined, state);
    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-email-validation-warning')).toBeNull();
    });
  });

  it('should display email validation warning if email is not approved', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-email-validation-warning')).toBeTruthy();
  });

  it('should open email validation modal when tapping on validation warning', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning-btn'));
    expect(await findByTestId('gift-card-detail-email-validation-modal-container')).toBeTruthy();
    expect(deps.apiService.sendValidationEmail).toBeCalled();
  });

  it('should close email validation modal when tapping on close button', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { queryByTestId, getByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
    fireEvent.press(getByTestId('modal-backdrop'));
    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-email-validation-modal-container')).toBeNull();
    });
  });

  it('should open support email link when tapping on FAQ on modal', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
    fireEvent.press(getByTestId('gift-card-detail-open-support-email-btn'));
    fireEvent.press(await findByTestId('gift-card-detail-open-support-email-btn-2'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(`mailto:${ENV.SYW_SUPPORT_EMAIL}?subject=SYW MAX - Customer Support`);
  });

  it('should open support SYW profile link when tapping on edit profile on modal', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    deps.nativeHelperService.linking.checkURLScheme = () => Promise.resolve(false);
    const { getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
    fireEvent.press(await findByTestId('gift-card-detail-open-edit-profile-btn'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(ENV.SYW_URL);
  });

  it('should open support SYW profile link on legacy app when tapping on edit profile on modal', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    deps.nativeHelperService.linking.checkURLScheme = () => Promise.resolve(true);
    const { getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
    fireEvent.press(await findByTestId('gift-card-detail-open-edit-profile-btn'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(ENV.SYW_APP_PROFILE);
  });

  it('should send validation email when tapping on resend on modal', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { getByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
      fireEvent.press(getByTestId('gift-card-detail-force-send-email-btn'));
    });
    expect(deps.apiService.sendValidationEmail).toBeCalled();
  });

  it('should show verified modal and close with button', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest
      .fn()
      .mockResolvedValueOnce({ ...getUser(), emailValidationStatus: EmailStatus.PENDING })
      .mockResolvedValueOnce({ ...getUser(), emailValidationStatus: EmailStatus.APPROVED });
    const { queryByTestId, getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    await waitFor(async () => {
      fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
      expect(await findByTestId('gift-card-detail-verified-mail-modal-container')).toBeTruthy();
    });
    fireEvent.press(getByTestId('gift-card-detail-verified-email-btn'));
    expect(queryByTestId('gift-card-detail-verified-mail-modal-container')).toBeNull();
  });

  it('should show verified modal and dismissed', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest
      .fn()
      .mockResolvedValueOnce({ ...getUser(), emailValidationStatus: EmailStatus.PENDING })
      .mockResolvedValueOnce({ ...getUser(), emailValidationStatus: EmailStatus.APPROVED });
    const { queryByTestId, getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    await waitFor(async () => {
      fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
      expect(await findByTestId('gift-card-detail-verified-mail-modal-container')).toBeTruthy();
    });
    fireEvent.press(queryByTestId('modal-backdrop'));
    expect(queryByTestId('gift-card-detail-verified-mail-modal-container')).toBeNull();
  });

  it('should show verification error modal', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn().mockRejectedValue({ error: 'error' });
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { queryByTestId, getByTestId, findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
    expect(await findByTestId('gift-card-detail-email-validation-fail-modal-container')).toBeTruthy();
    fireEvent.press(queryByTestId('modal-backdrop'));
  });

  it('should show suspended error modal', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.SUSPENDED;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.SUSPENDED });
    const { findByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    expect(findByTestId('account-critical-error-container')).toBeTruthy();
  });

  it('should wait until fetch profile finishes before sending email', async () => {
    state.user.currentUser.emailValidationStatus = EmailStatus.PENDING;
    const deps = getMockDeps();
    deps.apiService.sendValidationEmail = jest.fn();
    deps.apiService.fetchUserProfile = jest.fn().mockResolvedValue({ ...getUser(), emailValidationStatus: EmailStatus.PENDING });
    const { getByTestId } = renderWithGlobalContext(<RewardDetail {...props} />, deps, state);
    expect(deps.apiService.sendValidationEmail).not.toBeCalled();
    fireEvent.press(getByTestId('gift-card-detail-email-validation-warning'));
    await waitFor(() => {
      expect(deps.apiService.sendValidationEmail).toBeCalled();
    });
  });
});
