import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { getMission_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import LargeSurveyCard, { Props } from './LargeSurveyCard';

describe('LargeSurveyCard', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      survey: getMission_1()
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<LargeSurveyCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render be pressable', () => {
    const { getByTestId } = renderWithGlobalContext(<LargeSurveyCard {...props} />);
    fireEvent.press(getByTestId('large-survey-card-container'));
    expect(props.onPress).toBeCalled();
  });
});
