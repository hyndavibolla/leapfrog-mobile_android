import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import GiftCardSearchInput, { Props } from './GiftCardSearchInput';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getRewardConfig_1 } from '_test_utils/entities';
import { wait } from '_utils/wait';

describe('GiftCardSearchInput', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      text: '',
      categoryIdList: [],
      onChangeText: jest.fn(),
      disabled: false
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardSearchInput {...props} text="text from props" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with an open modal', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(
      <GiftCardSearchInput {...props} categoryIdList={[getRewardConfig_1().categories[1 /** omitting custom category */].id]} />
    );
    fireEvent.press(getByTestId('search-input-filter-btn'));
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled', async () => {
    const { toJSON } = renderWithGlobalContext(<GiftCardSearchInput {...props} disabled={true} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should change text', async () => {
    const search = 'anything';
    const { getByTestId } = renderWithGlobalContext(<GiftCardSearchInput {...props} />);
    fireEvent.changeText(getByTestId('search-input-input'), search);
    expect(props.onChangeText).toBeCalledWith(search);
  });
});
