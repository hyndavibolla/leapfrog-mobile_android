import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import OfferItem, { Props } from './OfferItem';
import { getActivity_1, getActivity_4 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('OfferItem', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      shouldShowSeparator: false,
      activity: getActivity_1(),
      onPress: jest.fn()
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<OfferItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with separator', async () => {
    props.shouldShowSeparator = true;
    const { toJSON } = renderWithGlobalContext(<OfferItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', async () => {
    const { getAllByTestId } = renderWithGlobalContext(<OfferItem {...props} />);
    fireEvent.press(getAllByTestId('offer-item-activity-row')[0]);
    expect(props.onPress).toBeCalledWith([props.activity, props.activity.offers[0]]);
  });

  it('should render gift card cc only item', async () => {
    props.activity = getActivity_4();
    const { toJSON } = renderWithGlobalContext(<OfferItem {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('giftcard should be pressable', () => {
    props.activity = getActivity_4();
    const { getAllByTestId } = renderWithGlobalContext(<OfferItem {...props} />);
    fireEvent.press(getAllByTestId('offer-item-activity-gc-row')[0]);
    expect(props.onPress).toBeCalledWith([props.activity, null]);
  });
});
