import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

import ApplicationModal, { Props } from './ApplicationModal';

describe('Application Modal', () => {
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      isVisible: true,
      handleShouldShowApplication: jest.fn()
    };
  });

  it('should render', () => {
    const { getByTestId } = renderWithGlobalContext(<ApplicationModal {...props} />, deps);
    expect(getByTestId('application-modal-container')).toBeTruthy();
  });

  it('should call handleShouldShowApplication when press close button', async () => {
    const { getByTestId } = renderWithGlobalContext(<ApplicationModal {...props} />, deps);
    fireEvent.press(getByTestId('application-modal-close-button'));
    expect(props.handleShouldShowApplication).toBeCalled();
  });

  it('should call handleShouldShowApplication when dismiss', async () => {
    const { getByTestId } = renderWithGlobalContext(<ApplicationModal {...props} />, deps);
    fireEvent.press(getByTestId('modal-backdrop'));
    expect(props.handleShouldShowApplication).toBeCalled();
  });

  it('should render in a small device', async () => {
    deps.nativeHelperService.dimensions.isSmallDevice = true;
    const { getByTestId } = renderWithGlobalContext(<ApplicationModal {...props} />, deps);
    expect(getByTestId('application-modal-container')).toHaveStyle({ height: 400 });
  });
});
