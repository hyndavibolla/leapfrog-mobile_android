import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';

import MapWidget, { Props } from './MapWidget';
import { styles } from './styles';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getCardLinkOffer_1 } from '../../../test-utils/entities';
import { wait } from '../../../utils/wait';

const mockOnPress = jest.fn();

describe('MapWidget', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      isActive: true,
      onPress: mockOnPress,
      offer: getCardLinkOffer_1()
    };
  });

  it('should render', () => {
    const { toJSON, queryByTestId } = renderWithGlobalContext(<MapWidget {...props} />);
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('map-widget-map-container')).toBeTruthy();
  });

  it('should render without an active offer', () => {
    props.isActive = false;
    const { getByTestId } = renderWithGlobalContext(<MapWidget {...props} />);
    expect(getByTestId('map-widget-miles-label').props.style[1]).not.toEqual(styles.milesLabelSelected);
  });

  it('should render the fallback error', () => {
    props.offer = null;
    const { queryByTestId } = renderWithGlobalContext(<MapWidget {...props} />);
    expect(queryByTestId('map-widget-fallback-container')).toBeTruthy();
  });

  it('should press the map', async () => {
    const { getByTestId } = renderWithGlobalContext(<MapWidget {...props} />);
    fireEvent.press(getByTestId('map-widget-map-container'));
    await act(() => wait(0));
    expect(mockOnPress).toBeCalledTimes(1);
  });

  it('should render Near your location text', async () => {
    props.offer.merchant.merchantDistance = undefined;
    const { queryByText } = renderWithGlobalContext(<MapWidget {...props} />);
    expect(queryByText('Near your location')).toBeTruthy();
  });
});
