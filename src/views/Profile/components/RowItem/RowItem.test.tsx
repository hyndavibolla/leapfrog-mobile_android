import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { RowItem, Props } from './RowItem';
import { wait } from '_utils/wait';
import GoOutIcon from '_assets/shared/goOutIcon.svg';

describe('RowItem', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      name: 'Edit your profile',
      onPress: jest.fn(),
      testIdName: 'edit-your-profile',
      icon: <GoOutIcon />
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<RowItem {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', async () => {
    const { getByTestId } = renderWithGlobalContext(<RowItem {...props} />);
    fireEvent.press(getByTestId('profile-row-item-edit-your-profile'));
    expect(props.onPress).toBeCalled();
  });
});
