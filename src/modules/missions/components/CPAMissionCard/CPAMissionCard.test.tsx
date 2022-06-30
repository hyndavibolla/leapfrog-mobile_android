import React from 'react';

import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import CPAMissionCard, { Props } from './CPAMissionCard';

describe('MediumMissionCard', () => {
  let onPress: () => void;
  let props: Props;
  beforeEach(() => {
    onPress = jest.fn();
    props = {
      mission: getMission_1(),
      onPress
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<CPAMissionCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
