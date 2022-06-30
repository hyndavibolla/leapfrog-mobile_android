import React from 'react';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { statusType } from '_models/giftCard';

import HeaderStatusButton, { Props } from './HeaderStatusButton';
import { ICON } from '_constants/icons';

describe('HeaderStatusButton', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      status: statusType.ACTIVE,
      onPress: jest.fn()
    };
  });

  it('should render with status ACTIVE', () => {
    const { getByTestId } = renderWithGlobalContext(<HeaderStatusButton {...props} />);

    expect(getByTestId('header-status-button-icon')).toBeTruthy();
    const button = getByTestId('header-status-button-pressable');
    expect(button.props.children[0].props.name).toBe(ICON.FOLDER_ARROW_DOWN);
  });

  it('should render with status HIDDEN', () => {
    props.status = statusType.HIDDEN;
    const { getByTestId } = renderWithGlobalContext(<HeaderStatusButton {...props} />);

    expect(getByTestId('header-status-button-icon')).toBeTruthy();
    const button = getByTestId('header-status-button-pressable');
    expect(button.props.children[0].props.name).toBe(ICON.FOLDER_ARROW_UP);
  });
});
