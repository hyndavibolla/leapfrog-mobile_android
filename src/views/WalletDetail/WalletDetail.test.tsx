import React from 'react';
import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native';

import WalletDetail, { Props } from './WalletDetail';

import { getInitialState } from '_state_mgmt/GlobalState';
import { Deps, IGlobalState } from '_models/general';
import { EnrollmentEventType } from '_models/cardLink';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getActivity_1, getActivity_2, getLinkedCards_2 } from '_test_utils/entities';
import { ROUTES } from '_constants/routes';
import { EventDetail, PageType, TealiumEventType, UxObject } from '_constants/eventTracking';
import { ENV } from '_constants/env';
import * as createUUID from '_utils/create-uuid';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack
  })
}));

describe('WalletDetail', () => {
  let props: Props;
  let state: IGlobalState;
  let deps: Deps;

  beforeEach(() => {
    Date.now = () => 1980;
    state = getInitialState();
    deps = getMockDeps();
    props = {
      route: {
        params: {
          cardId: getLinkedCards_2().cardId,
          isLinkedToCardlink: true,
          isSywCard: true,
          cardLastFour: getLinkedCards_2().cardLastFour
        }
      }
    };
    jest
      .spyOn(createUUID, 'createUUID')
      .mockImplementationOnce(() => '0')
      .mockImplementationOnce(() => '1')
      .mockImplementationOnce(() => '2')
      .mockImplementationOnce(() => '3');
  });

  it('should render ECM card detail', async () => {
    props.route.params.isSywCard = false;
    state.cardLink.linkedCardsList = [getLinkedCards_2()];

    const { toJSON } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should render a nonECM card detail screen', async () => {
    const { toJSON } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should render correctly the banner and the last 4 numbers of the card', async () => {
    state.cardLink.linkedCardsList = [getLinkedCards_2()];

    const { getByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);
    await waitFor(() => expect(getByTestId('wallet-detail-card-text')).toHaveTextContent(getLinkedCards_2().cardLastFour));
  });

  it('should render unlink card button and show the modal', async () => {
    const { getByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);

    fireEvent.press(getByTestId('wallet-detail-unlink-card'));
    await waitFor(() => expect(getByTestId('wallet-detail-syw-unlink-modal-container')).toBeTruthy());
  });

  it('should render link card button', async () => {
    props.route.params.isLinkedToCardlink = false;

    const { getByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);
    await waitFor(() => expect(getByTestId('wallet-detail-link-card')).toBeTruthy());
  });

  it('should call manage card button', async () => {
    const { getByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);
    fireEvent.press(getByTestId('wallet-detail-manage-card'));
    await waitFor(() => expect(mockNavigate).toBeCalledWith(ROUTES.MANAGE_SYW_CARD));
  });

  it('should open the unlink SYW card and call unenrollment Card', async () => {
    const linkedCard = getLinkedCards_2();

    const initialStateGetter = () => {
      const initialState = getInitialState();
      initialState.core.lastRouteKey = ROUTES.WALLET_DETAIL;
      initialState.user.currentUser.sywUserId = '123456';
      initialState.user.currentUser.personal.sywMemberNumber = '1234567890123456';
      return initialState;
    };

    deps = getMockDeps(initialStateGetter);
    deps.nativeHelperService.platform.OS = 'android';
    state.cardLink.linkedCardsList = [linkedCard];

    props.route.params.cardId = linkedCard.cardId;

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, deps, state);

    expect(queryByTestId('wallet-detail-syw-unlink-modal-container')).toBeNull();
    fireEvent.press(queryByTestId('wallet-detail-unlink-card'));
    expect(getByTestId('wallet-detail-syw-unlink-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('wallet-detail-unenrollment-card-button'));
    await waitForElementToBeRemoved(() => getByTestId('wallet-detail-syw-unlink-modal-container'));
    expect(queryByTestId('wallet-detail-syw-unlink-modal-container')).toBeNull();

    expect(deps.apiService.enrollCard).toBeCalledWith({
      eventType: EnrollmentEventType.UNENROLL,
      programDetail: {
        ...linkedCard
      }
    });
    expect(deps.eventTrackerService.tealiumSDK.track).toBeCalledWith(TealiumEventType.CARD, {
      '5321_cardmember': 'no',
      address: `${ENV.SCHEME}${ROUTES.WALLET_DETAIL}`,
      app_name: 'native',
      brand_category: undefined,
      brand_id: undefined,
      brand_name: undefined,
      error: undefined,
      event_detail: EventDetail.UNENROLL,
      event_name: TealiumEventType.CARDLINK,
      event_type: TealiumEventType.CARD,
      exit_link: undefined,
      iframe: undefined,
      instance: 'sywmax',
      login_state: 'authenticated',
      marketing_id: undefined,
      member_level: undefined,
      page_name: `Main > Wallet > Linked Card > ${linkedCard.cardLastFour}`,
      page_type: PageType.INFO,
      push_trigger: undefined,
      search_term: undefined,
      section: 'wallet',
      select_category: undefined,
      sort_by: undefined,
      syw_id: '123456',
      tid: '1234567890123456',
      touchpoint: 'android',
      user_type: undefined,
      uxObject: UxObject.BUTTON
    });
  });

  it('should open the unlink regular card and call remove Card', async () => {
    props.route.params.isSywCard = false;
    props.route.params.cardId = 'test-1234';

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);

    expect(queryByTestId('wallet-detail-card-unlink-modal-container')).toBeNull();
    fireEvent.press(getByTestId('wallet-detail-remove-card'));
    expect(getByTestId('wallet-detail-card-unlink-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('wallet-detail-remove-card-button'));
    await waitForElementToBeRemoved(() => getByTestId('wallet-detail-card-unlink-modal-container'));
    expect(mockGoBack).toBeCalledTimes(1);
  });

  it('should open and close the SYW modal unlink card', async () => {
    const { findByTestId, getByTestId, queryByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);

    fireEvent.press(getByTestId('wallet-detail-unlink-card'));
    expect(await findByTestId('wallet-detail-syw-unlink-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('wallet-detail-cancel-button'));
    expect(queryByTestId('wallet-detail-syw-unlink-modal-container')).toBeNull();
  });

  it('should open and close the regular modal unlink card', async () => {
    props.route.params.isSywCard = false;
    const { findByTestId, getByTestId, queryByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);

    fireEvent.press(getByTestId('wallet-detail-remove-card'));
    expect(await findByTestId('wallet-detail-card-unlink-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('wallet-detail-remove-cancel-button'));
    expect(queryByTestId('wallet-detail-card-unlink-modal-container')).toBeNull();
  });

  it('should close the unlink modal when was pressed outside', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);

    expect(queryByTestId('wallet-detail-syw-unlink-modal-container')).toBeNull();
    fireEvent.press(getByTestId('wallet-detail-unlink-card'));
    expect(getByTestId('wallet-detail-syw-unlink-modal-container')).toBeTruthy();
    fireEvent.press(getByTestId('modal-backdrop'));
    await waitFor(() => expect(queryByTestId('wallet-detail-syw-unlink-modal-container')).toBeNull());
  });

  it('should navigate to cardlink', async () => {
    props.route.params.isLinkedToCardlink = false;

    const { getByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, undefined, state);
    fireEvent.press(getByTestId('wallet-detail-link-card'));
    await waitFor(() => expect(mockNavigate).toBeCalledWith(ROUTES.IN_STORE_OFFERS.CARD_LINK));
  });

  it('should load more on user interaction', async () => {
    deps.apiService.fetchStreakList = jest.fn().mockResolvedValue(null);
    deps.apiService.fetchActivityHistory = jest
      .fn()
      .mockResolvedValueOnce([
        { ...getActivity_1(), timestamp: 2 },
        { ...getActivity_2(), timestamp: 2 }
      ])
      .mockResolvedValueOnce([
        { ...getActivity_1(), timestamp: 1 },
        { ...getActivity_2(), timestamp: 1 }
      ]);
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, deps);
    await waitFor(() => {
      expect(getAllByTestId('offer-item-activity-row')).toHaveLength(3);
      fireEvent(getByTestId('activity-history-list'), 'onEndReached');
    });

    expect(getAllByTestId('offer-item-activity-row')).toHaveLength(6);
  });

  it('should display activities even the activities do not have an offer', async () => {
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValueOnce([
      {
        ...getActivity_1(),
        offers: null
      }
    ]);

    const { findByTestId } = renderWithGlobalContext(<WalletDetail {...props} />, deps);
    expect(await findByTestId('activity-history-list')).toBeTruthy();
  });
});
