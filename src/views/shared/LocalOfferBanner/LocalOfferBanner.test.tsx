import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import LocalOfferBanner, { Props } from './LocalOfferBanner';

describe('LocalOfferBanner', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onPress: jest.fn()
    };
  });

  it('should render with a title', () => {
    props.title = 'Hungry? Search restaurants near you!';
    const { getByTestId } = render(<LocalOfferBanner {...props} />);
    expect(getByTestId('local-offer-banner-container')).toHaveTextContent(props.title);
  });

  it('should render with a description', () => {
    props.description = 'Enable your location to search for local offers.';
    const { getByTestId } = render(<LocalOfferBanner {...props} />);
    expect(getByTestId('local-offer-banner-container')).toHaveTextContent(props.description);
  });

  it('should be pressable', () => {
    const { getByTestId } = render(<LocalOfferBanner {...props} />);
    fireEvent.press(getByTestId('local-offer-banner-touchable'));
    expect(props.onPress).toBeCalled();
  });
});
