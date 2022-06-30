import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

import GetSYWCard, { Props } from './GetSYWCard';

describe('Get SYW Card', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onPress: jest.fn(),
      btnText: 'Got it'
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<GetSYWCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should open the card link', () => {
    const { getByTestId, deps } = renderWithGlobalContext(<GetSYWCard {...props} />);
    fireEvent.press(getByTestId('get-syw-card-card-link'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(expect.any(String));
  });

  it('should have a pressable apply btn', () => {
    const { getByTestId } = renderWithGlobalContext(<GetSYWCard {...props} />);
    fireEvent.press(getByTestId('get-syw-card-apply-btn'));
    expect(props.onPress).toBeCalled();
  });
});
