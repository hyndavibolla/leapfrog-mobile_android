import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import LeaveSurveyModal, { Props } from './LeaveSurveyModal';

describe('LeaveSurveyModal', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onLeaveSurvey: jest.fn(),
      onCancel: jest.fn()
    };
  });

  it('should render', () => {
    const { toJSON } = render(<LeaveSurveyModal {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should have a pressable leave survey button', () => {
    const { getByTestId } = render(<LeaveSurveyModal {...props} />);
    fireEvent.press(getByTestId('leave-survey-modal-leave-btn'));
    expect(props.onLeaveSurvey).toBeCalled();
  });

  it('should have a pressable cancel button', () => {
    const { getByTestId } = render(<LeaveSurveyModal {...props} />);
    fireEvent.press(getByTestId('leave-survey-modal-cancel-btn'));
    expect(props.onCancel).toBeCalled();
  });
});
