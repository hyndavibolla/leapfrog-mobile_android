import React from 'react';
import AppleWalletService from '_services/AppleWalletService';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { statusType } from '_models/giftCard';

import { getGiftCardDetail, getGiftCardBalance, getGiftCard } from '_test_utils/entities';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { COLOR, ROUTES, TealiumEventType, UxObject } from '_constants';

jest.useFakeTimers('legacy');
jest.spyOn(global, 'setTimeout');

import { GiftCardDetail, Props } from './GiftCardDetail';

describe('GiftCard Detail', () => {
  let deps: Deps;
  let state: IGlobalState;
  let props: Props;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
    props = {
      route: {
        params: {
          giftCardId: 'abc123',
          cardBalance: 10,
          statusInd: statusType.ACTIVE,
          cardProvider: 'RAISE'
        }
      },
      navigation: {
        setOptions: jest.fn().mockImplementation(({ header }) => header()),
        navigate: jest.fn()
      } as any
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render (iOS)', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    AppleWalletService.canAddPasses = jest.fn().mockResolvedValueOnce(true);

    const { toJSON, getByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      expect(getByTestId('gift-card-detail-add-to-apple-wallet')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render add to android wallet if is android', async () => {
    deps.nativeHelperService.platform.OS = 'android';

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      expect(getByTestId('gift-card-detail-add-to-android-wallet')).toBeTruthy();
      expect(queryByTestId('gift-card-detail-add-to-apple-wallet')).toBeNull();
    });
  });

  it('should not display add to Apple wallet if the device does not support it', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    AppleWalletService.canAddPasses = jest.fn().mockResolvedValueOnce(false);

    const { queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-add-to-apple-wallet')).toBeNull();
    });
  });

  it('should not display add to Apple wallet if the device cannot check for support (error)', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    AppleWalletService.canAddPasses = jest.fn().mockRejectedValueOnce('error');

    const { queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-add-to-apple-wallet')).toBeNull();
    });
  });

  it('should render the fallback when there is an error', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockRejectedValueOnce('error');

    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-fallback')).toBeTruthy();
  });

  it('should show the toast when copying to clipboard', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-copy'));
      expect(deps.nativeHelperService.clipboard.setString).toBeCalled();
      expect(getByTestId('toast-container')).toBeTruthy();
      jest.runAllTimers();
    });

    expect(queryByTestId('toast-container')).toBeNull();
  });

  it('should show the toast when adding to apple wallet', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    AppleWalletService.canAddPasses = jest.fn().mockResolvedValueOnce(true);
    AppleWalletService.addPassWithId = jest.fn().mockResolvedValueOnce(true);

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-add-to-apple-wallet'));
      expect(AppleWalletService.addPassWithId).toBeCalled();
      expect(getByTestId('toast-container')).toBeTruthy();
      jest.runAllTimers();
    });

    expect(queryByTestId('toast-container')).toBeNull();
  });

  it('should show fail the toast when adding to apple wallet', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    AppleWalletService.canAddPasses = jest.fn().mockResolvedValueOnce(true);
    AppleWalletService.addPassWithId = jest.fn().mockResolvedValueOnce(false);

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-add-to-apple-wallet'));
      expect(AppleWalletService.addPassWithId).toBeCalled();
      jest.runAllTimers();
      expect(queryByTestId('toast-container')).toBeNull();
    });
  });

  it("should log an error when the gift card can't be added to Apple Wallet", async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    deps.apiService.fetchAppleWalletPass = jest.fn().mockResolvedValueOnce('base64-encoded-data');
    AppleWalletService.canAddPasses = jest.fn().mockResolvedValueOnce(true);
    AppleWalletService.addPassWithId = jest.fn().mockRejectedValueOnce('error');

    const { getByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-add-to-apple-wallet'));
      expect(deps.logger.error).toBeCalled();
    });
  });

  it('when add to android wallet is pressed should call endpoints and navigate to the webview', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    deps.apiService.fetchAndroidWalletPass = jest.fn().mockResolvedValueOnce({
      saveUri: 'https://google-api-example'
    });

    const { getByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-add-to-android-wallet'));
      expect(deps.apiService.fetchAndroidWalletPass).toBeCalled();
      expect(props.navigation.navigate).toBeCalledWith(ROUTES.GIFT_CARD_GOOGLE_PAY, {
        apiGoogleUrl: 'https://google-api-example',
        title: 'brandName'
      });
    });
  });

  it('check balance value should be - if the check balance is not tap and cardBalance and cardBalance from params are null', async () => {
    props.route.params.cardBalance = null;
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce({
      ...getGiftCardDetail(),
      cardBalance: null
    });

    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-value')).toHaveTextContent('-');
  });

  it('check balance value should be cardBalance from params if the check balance is not tap', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce(getGiftCardDetail());

    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-value')).toHaveTextContent('$10');
  });

  it('check balance value should be cardBalance from gift card detail if the check balance is not tap and cardBalance from params is null', async () => {
    props.route.params.cardBalance = null;
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce(getGiftCardDetail());

    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-value')).toHaveTextContent('$10');
  });

  it('check balance value should show a dash if gift card available checks is zero and has no balance url', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce({ ...getGiftCardDetail(), balance_checks_available: 0, balance_check_url: 'NA' });

    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-value')).toHaveTextContent('-');
  });

  it('if gift card available check balance is 1 or higher show modal', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce(getGiftCardDetail());

    const { getByTestId, toJSON } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-check-balance-button'));
      expect(getByTestId('check-balance-modal-container')).toBeTruthy();
      fireEvent.press(getByTestId('modal-backdrop'));
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('on check balance should display new balance', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValue(getGiftCardDetail());
    deps.apiService.fetchGiftCardBalance = jest.fn().mockResolvedValue(getGiftCardBalance());

    const { getByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-check-balance-button'));
      expect(getByTestId('check-balance-modal-container')).toBeTruthy();
      fireEvent.press(getByTestId('check-balance-modal-yes-button'));
      expect(deps.apiService.fetchGiftCardDetail).toBeCalledWith(props.route.params.giftCardId);
      expect(deps.apiService.fetchGiftCardBalance).toBeCalledWith(props.route.params.giftCardId);
    });

    expect(getByTestId('gift-card-detail-balance-value')).toHaveTextContent('$15');
  });

  it('show toast if check available is 0', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce({ ...getGiftCardDetail(), balance_check_url: 'NA', balance_checks_available: 0 });

    const { queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-check-balance-button')).toBeNull();
    });
  });

  it('check balance webview once the balance check available is 0', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce({
      ...getGiftCardDetail(),
      balance_checks_available: 0
    });

    const { getByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-check-balance-button'));
      expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(
        TealiumEventType.WALLET,
        expect.objectContaining({
          uxObject: UxObject.BUTTON,
          event_name: TealiumEventType.WALLET,
          event_type: 'check_balance',
          event_detail: 'check_balance_webview',
          brand_name: getGiftCardDetail()?.brandName,
          brand_id: props.route.params.giftCardId
        })
      );
    });
  });

  it('check balance webview once the balance check available is null', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce({ ...getGiftCardDetail(), balance_checks_available: null });
    const giftcardName = getGiftCardDetail()?.brandName;
    const { getByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    await waitFor(() => fireEvent.press(getByTestId('gift-card-detail-check-balance-button')));

    expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(
      TealiumEventType.WALLET,
      expect.objectContaining({
        uxObject: UxObject.BUTTON,
        event_name: TealiumEventType.WALLET,
        event_type: 'check_balance',
        event_detail: 'check_balance_webview',
        brand_name: giftcardName,
        brand_id: props.route.params.giftCardId
      })
    );
  });

  it('should show fallback toast when balance check api returns an error', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValue(getGiftCardDetail());
    deps.apiService.fetchGiftCardBalance = jest.fn().mockRejectedValueOnce('error');

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      fireEvent.press(getByTestId('gift-card-detail-check-balance-button'));
      fireEvent.press(getByTestId('check-balance-modal-yes-button'));
      expect(getByTestId('toast-container')).toBeTruthy();
      jest.runAllTimers();
      expect(queryByTestId('toast-container')).toBeNull();
    });
  });

  it('should not show balance date if gift card is not on gift card list', async () => {
    state.giftCard.giftCardsList = [];
    const { queryByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);

    await waitFor(() => {
      expect(queryByTestId('gift-card-detail-balance-date')).toBeNull();
    });
  });

  it('should show a dash on balance date if gift card is on gift card list and cardBalanceCheckDt and purchaseTs are null', async () => {
    props.route.params.giftCardId = '93ed4685-fa5e-465e-a2ba-217a3903f28d';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-date')).toHaveTextContent('-');
  });

  it('should show a dash on balance date if gift card is on gift card list and cardBalanceCheckDt and purchaseTs are the exact same date', async () => {
    props.route.params.giftCardId = '93ed4685-fa5e-465e-a2ba-217a3903f28d';
    state.giftCard.giftCardsList = [{ ...getGiftCard(), cardBalanceCheckDt: '2022-02-20T12:20:00.000Z', purchaseTs: '2022-02-20T12:20:00.000Z' }];
    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-date')).toHaveTextContent('-');
  });

  it('should show last card balance date if gift card is on gift card list and cardBalanceCheckDt and purchaseTs are not the exact date', async () => {
    props.route.params.giftCardId = '93ed4685-fa5e-465e-a2ba-217a3903f28d';
    state.giftCard.giftCardsList = [{ ...getGiftCard(), cardBalanceCheckDt: '2022-02-20T14:20:00.000Z', purchaseTs: '2022-02-20T12:20:00.000Z' }];
    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-balance-date')).toHaveTextContent('d ago');
  });

  it('should render the box card header with gray background color when the status is hidden', async () => {
    props.route.params.statusInd = statusType.HIDDEN;
    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('gift-card-detail-box-card-header')).toHaveStyle({
      backgroundColor: COLOR.DARK_GRAY
    });
  });

  it('should render EmptyBarCode component when the brand does not has barcode attribute', async () => {
    deps.apiService.fetchGiftCardDetail = jest.fn().mockResolvedValueOnce({ ...getGiftCardDetail(), barcode: null });
    const { findByTestId } = renderWithGlobalContext(<GiftCardDetail {...props} />, deps, state);
    expect(await findByTestId('empty-bar-code-body')).toBeTruthy();
  });
});
