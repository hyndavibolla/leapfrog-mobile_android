import React from 'react';
import LinkedCardList, { Props } from './LinkedCardList';
import { renderWithGlobalContext } from '../../../../test-utils/renderWithGlobalContext';
import { getMockDeps } from '../../../../test-utils/getMockDeps';
import { Deps } from '../../../../models/general';
import { act } from 'react-test-renderer';
import { wait } from '../../../../utils/wait';
import { getLinkedCards_1, getLinkedCards_2 } from '../../../../test-utils/entities';
import { fireEvent } from '@testing-library/react-native';
import { ROUTES } from '../../../../constants';
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ navigate: mockNavigate }), useIsFocused: () => true }));
describe('LinkedCardList', () => {
  let deps: Deps;
  let props: Props;
  beforeEach(() => {
    deps = getMockDeps();
    props = {
      linkedCardsListError: null,
      linkedCardsList: []
    };
  });
  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<LinkedCardList {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render empty container banner', async () => {
    props.linkedCardsListError = 'error';
    const { queryByTestId, toJSON } = renderWithGlobalContext(<LinkedCardList {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('empty-state-card')).toBeTruthy();
  });
  it('should navigate to add card webview', async () => {
    props.linkedCardsList = [getLinkedCards_2(), getLinkedCards_1()];
    const { queryAllByTestId } = renderWithGlobalContext(<LinkedCardList {...props} />, deps);
    await act(() => wait(0));
    fireEvent.press(queryAllByTestId('linked-cards-add-another-card-btn')[0]);
    expect(mockNavigate).toBeCalledWith(ROUTES.IN_STORE_OFFERS.CARD_LINK);
  });
});
