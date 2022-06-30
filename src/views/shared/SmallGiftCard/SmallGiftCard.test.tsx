import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import SmallGiftCard, { Props, Orientation } from './SmallGiftCard';

describe('SmallGiftCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      image: 'https://i0.pngocean.com/files/298/294/566/tilta-logo-brand-product-font-apple-music-logo.jpg',
      title: 'iTunes',
      orientation: Orientation.HORIZONTAL,
      onPress: jest.fn()
    };
  });

  it('should render horizontal by default', () => {
    const { toJSON } = renderWithGlobalContext(<SmallGiftCard {...props} orientation={undefined} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render vertical', () => {
    const { toJSON } = renderWithGlobalContext(<SmallGiftCard {...props} orientation={Orientation.VERTICAL} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should with a fallback image', () => {
    props.image = null;
    const { toJSON } = renderWithGlobalContext(<SmallGiftCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', async () => {
    const { findByTestId } = renderWithGlobalContext(<SmallGiftCard {...props} />);
    fireEvent.press(await findByTestId('small-gift-card-container'));
    expect(props.onPress).toBeCalled();
  });
});
