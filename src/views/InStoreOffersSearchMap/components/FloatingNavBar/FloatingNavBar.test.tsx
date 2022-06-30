import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';

import FloatingNavBar, { Props } from './FloatingNavBar';

import { renderWithGlobalContext } from '../../../../test-utils/renderWithGlobalContext';
import { wait } from '../../../../utils/wait';
import { getCardLinkOffer_1 } from '../../../../test-utils/entities';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({ goBack: mockGoBack }) }));

describe('Search', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      searchValue: '',
      setSearchValue: jest.fn(),
      onPressSearch: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should go back when the arrow left icon is pressed', () => {
    const { getByTestId } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    fireEvent.press(getByTestId('back-button-default'));
    expect(mockGoBack).toBeCalled();
  });

  it('should go back when the arrow left icon is pressed and there is a selected offer', () => {
    props.selectedOffer = getCardLinkOffer_1();
    const { getByTestId } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    fireEvent.press(getByTestId('floating-nav-bar-back'));
    expect(mockGoBack).toBeCalled();
  });

  it('should render the close icon', () => {
    props.searchValue = 'lorem ipsum';
    const { getByTestId } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    expect(getByTestId('floating-nav-bar-close')).toBeTruthy();
  });

  it('should clean the search', async () => {
    props.searchValue = 'lorem ipsum';
    const { getByTestId } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    expect(getByTestId('floating-nav-bar-close')).toBeTruthy();
    fireEvent.press(getByTestId('floating-nav-bar-close'));
    await act(() => wait(0));
    expect(props.setSearchValue).toBeCalledWith('');
  });

  it('should search when the search icon is pressed', async () => {
    props.searchValue = 'lorem ipsum';
    const { getByTestId } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    fireEvent.press(getByTestId('floating-nav-bar-search'));
    await act(() => wait(0));
    expect(props.onPressSearch).toBeCalled();
  });

  it('should search when the enter is pressed', async () => {
    props.searchValue = 'lorem ipsum';
    const { getByTestId } = renderWithGlobalContext(<FloatingNavBar {...props} />);
    fireEvent(getByTestId('floating-nav-bar-input'), 'onSubmitEditing');
    await act(() => wait(0));
    expect(props.onPressSearch).toBeCalled();
  });
});
