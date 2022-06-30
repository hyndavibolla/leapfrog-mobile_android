import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import PetiteMissionCard, { Props } from './PetiteMissionCard';
import { OfferModel } from '../../../models';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

describe('PetiteMissionCard', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      image: 'i.am.an.image.png',
      category: OfferModel.ProgramSubCategory.GROCERY,
      onPress: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<PetiteMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should be pressable', async () => {
    const { findByTestId } = renderWithGlobalContext(<PetiteMissionCard {...props} />);
    fireEvent.press(await findByTestId('petite-mission-card-container'));
    expect(props.onPress).toBeCalled();
  });
});
