import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';

import { ROUTES } from '_constants/routes';
import { getGiftCard } from '_test_utils/entities';
import { statusType } from '_models/giftCard';

import YourGiftCards, { Props } from './YourGiftCards';

describe('YourGiftCards', () => {
  let props: Props;
  let state: IGlobalState;
  let deps: Deps;
  let render;

  beforeEach(() => {
    state = getInitialState();
    deps = getMockDeps();
    props = {
      navigation: { navigate: jest.fn() } as any,
      route: {
        params: {
          showYourGiftCards: true
        }
      }
    };
    const { Screen, Navigator } = createStackNavigator();
    render = (newProps, newDeps, newState) => {
      const Component = () => <YourGiftCards {...props} {...(newProps || {})} />;
      return renderWithGlobalContext(
        <NavigationContainer>
          <Navigator>
            <Screen name="route" component={Component} />
          </Navigator>
        </NavigationContainer>,
        newDeps,
        newState
      );
    };
  });

  it('should render without param showYourGiftCards', () => {
    props.route.params.showYourGiftCards = undefined;
    deps.apiService.fetchActivityHistory = jest.fn().mockResolvedValue([getGiftCard()]);
    const { toJSON } = render(<YourGiftCards {...props} />, deps, state);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should NOT render', () => {
    state.giftCard.giftCardsList = [];
    const { queryByTestId } = render(<YourGiftCards {...props} />, deps, state);
    expect(queryByTestId('gift-card-container')).toBeNull();
  });

  it('should navigate to details', () => {
    state.giftCard.giftCardsList = [getGiftCard()];
    const { getAllByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getAllByTestId('gift-card-container')[0]);
    expect(props.navigation.navigate).toBeCalledWith(
      ROUTES.GIFT_CARD_LIST_DETAIL,
      expect.objectContaining({ giftCardId: expect.any(String), title: expect.any(String) })
    );
  });

  it('should navigate to rewards tab', () => {
    const { getByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getByTestId('wallet-your-gc-buy-gift-card'));
    expect(props.navigation.navigate).toBeCalledWith(ROUTES.MAIN_TAB.REWARDS);
  });

  it('should not render swipeable component', () => {
    deps.nativeHelperService.platform.OS = 'android';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { queryByTestId } = render(<YourGiftCards {...props} />, deps, state);
    expect(queryByTestId('swipe-item-element')).toBeNull();
  });

  it('should action swipe (ios)', () => {
    deps.nativeHelperService.platform.OS = 'ios';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { getAllByTestId, getByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getAllByTestId('swipe-item-right-button')[0]);
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
  });

  it('should not action swipe show up on android', () => {
    deps.nativeHelperService.platform.OS = 'android';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { queryAllByTestId } = render(<YourGiftCards {...props} />, deps, state);
    expect(queryAllByTestId('swipe-item-right-button')[0]).toBeUndefined();
  });

  it('should navigate to details (android)', () => {
    deps.nativeHelperService.platform.OS = 'android';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { getAllByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getAllByTestId('gift-card-container')[0]);
    expect(props.navigation.navigate).toBeCalledWith(
      ROUTES.GIFT_CARD_LIST_DETAIL,
      expect.objectContaining({ giftCardId: expect.any(String), title: expect.any(String) })
    );
  });

  it('should action a long press (android)', () => {
    deps.nativeHelperService.platform.OS = 'android';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { getAllByTestId, getByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent(getAllByTestId('gift-card-container')[0], 'longPress');
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
  });

  it('should not action a long press show up on ios', () => {
    deps.nativeHelperService.platform.OS = 'ios';
    state.giftCard.giftCardsList = [getGiftCard()];
    const { queryAllByTestId } = render(<YourGiftCards {...props} />, deps, state);
    expect(queryAllByTestId('gift-card-container')[0]).not.toHaveProp('longPress');
  });

  it('should render the fallback when there is not gift cards actives', () => {
    state.giftCard.giftCardsList = [];
    const { getByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent(getByTestId('wallet-your-gc-see-actives'), 'onPress');
    expect(getByTestId('wallet-your-gc-fallback')).toBeTruthy();
  });

  it('should render the fallback when there is not gift cards archive', () => {
    state.giftCard.giftCardsList = [];
    const { getByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent(getByTestId('wallet-your-gc-see-archives'), 'onPress');
    expect(getByTestId('wallet-your-gc-fallback')).toBeTruthy();
  });

  it('should not render the fallback when there is gift cards archive', () => {
    state.giftCard.giftCardsList = [{ ...getGiftCard(), statusInd: statusType.HIDDEN }];
    const { queryByTestId, getByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent(getByTestId('wallet-your-gc-see-archives'), 'onPress');
    expect(queryByTestId('wallet-your-gc-fallback')).toBeNull();
  });

  it('should dismiss modal with cancel button', () => {
    deps.nativeHelperService.platform.OS = 'ios';
    state.giftCard.giftCardsList = [getGiftCard()];

    const { getAllByTestId, getByTestId, queryByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getAllByTestId('swipe-item-right-button')[0]);
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
    fireEvent.press(getByTestId('archive-confirmation-modal-cancel-button'));
    expect(queryByTestId('archive-confirmation-modal')).toBeNull();
  });

  it('should dismiss modal when press confirm button and giftcard status is active', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    state.giftCard.giftCardsList = [getGiftCard()];

    const { getAllByTestId, getByTestId, queryByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getAllByTestId('swipe-item-right-button')[0]);
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
    fireEvent.press(getByTestId('archive-confirmation-modal-confirm-button'));
    expect(deps.apiService.updateCardStatus).toBeCalledWith({
      id: getGiftCard().providerCardId,
      status: statusType.HIDDEN,
      cardProvider: getGiftCard().cardProvider
    });
    await waitFor(() => {
      expect(queryByTestId('archive-confirmation-modal')).toBeNull();
    });
  });

  it('should dismiss modal when press confirm button and giftcard status is hidden', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    state.giftCard.giftCardsList = [{ ...getGiftCard(), statusInd: statusType.HIDDEN }];

    const { getAllByTestId, getByTestId, queryByTestId } = render(<YourGiftCards {...props} />, deps, state);
    fireEvent.press(getByTestId('wallet-your-gc-see-archives'));
    fireEvent.press(getAllByTestId('swipe-item-right-button')[0]);
    expect(getByTestId('archive-confirmation-modal-content')).toBeTruthy();
    fireEvent.press(getByTestId('archive-confirmation-modal-confirm-button'));
    expect(deps.apiService.updateCardStatus).toBeCalledWith({
      id: getGiftCard().providerCardId,
      status: statusType.ACTIVE,
      cardProvider: getGiftCard().cardProvider
    });
    await waitFor(() => expect(queryByTestId('archive-confirmation-modal')).toBeNull());
  });
});
