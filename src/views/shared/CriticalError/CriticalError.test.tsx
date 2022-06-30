import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Deps } from '../../../models/general';
import { getMockDeps } from '../../../test-utils/getMockDeps';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import CriticalError from './CriticalError';

describe('CriticalError', () => {
  console.error = console.warn = () => null;
  let deps: Deps;
  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<CriticalError />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should refresh the app', () => {
    const { getByTestId } = renderWithGlobalContext(<CriticalError />, deps);
    fireEvent.press(getByTestId('critical-error-refresh-btn'));
    expect(deps.nativeHelperService.restart).toBeCalled();
  });

  it('should refresh the app with an invalid token', () => {
    (deps.apiService as any).isTokenInvalid = true;
    const { getByTestId } = renderWithGlobalContext(<CriticalError />, deps);
    fireEvent.press(getByTestId('critical-error-refresh-btn'));
    expect(deps.logger.debug).toBeCalledWith('useLogout', { soft: false });
  });
});
