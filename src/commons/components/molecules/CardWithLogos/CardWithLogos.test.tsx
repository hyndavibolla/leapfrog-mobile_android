import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import CardWithLogos, { Props } from './CardWithLogos';

describe('CardWithLogos', () => {
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      title: 'My Title',
      logos: [
        'http://myimage.com/image.png',
        'http://myimage.com/image.png',
        'http://myimage.com/image.png',
        'http://myimage.com/image.png',
        'http://myimage.com/image.png',
        'http://myimage.com/image.png',
        'http://myimage.com/image.png',
        'http://myimage.com/image.png'
      ],
      onPress: jest.fn()
    };
  });

  it('should render with title', () => {
    const { getByTestId } = renderWithGlobalContext(<CardWithLogos {...props} />);
    expect(getByTestId('card-with-logos-title')).toHaveTextContent(props.title);
  });

  it(`should render 2 logos and a counter if it is not a small device`, () => {
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(<CardWithLogos {...props} />);
    expect(getByTestId('card-with-logos-counter')).toBeTruthy();
    expect(getAllByTestId('card-with-logos-item')).toHaveLength(2);
  });

  it('should render 1 logo and a counter if it is a small device', () => {
    deps.nativeHelperService.dimensions.isSmallDevice = true;
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(<CardWithLogos {...props} />, deps);
    expect(getByTestId('card-with-logos-counter')).toBeTruthy();
    expect(getAllByTestId('card-with-logos-item')).toHaveLength(1);
  });

  it('should call onPress if prop is defined', async () => {
    const { getByTestId } = renderWithGlobalContext(<CardWithLogos {...props} />);
    fireEvent.press(getByTestId('card-with-logos-pressable-container'));
    expect(props.onPress).toHaveBeenCalled();
  });
});
