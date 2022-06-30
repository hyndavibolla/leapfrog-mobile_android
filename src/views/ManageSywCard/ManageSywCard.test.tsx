import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';
import { ManageSywCard } from './ManageSywCard';
import { wait } from '../../utils/wait';
import { ENV } from '../../constants';
import { getMockDeps } from '../../test-utils/getMockDeps';
import { Deps } from '../../models/general';

describe('Apply Now', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', async () => {
    const { toJSON, queryByTestId } = renderWithGlobalContext(<ManageSywCard />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('manage-syw-card-scroll-view')).toBeTruthy();
  });

  it('should call citi by phone', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ManageSywCard />, deps);
    await act(() => wait(0));
    fireEvent.press(await queryByTestId('manage-syw-card-phone-link'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(expect.stringContaining(ENV.CITI.PHONE_NUMBER));
  });

  it('should call citi landing', async () => {
    const { queryByTestId } = renderWithGlobalContext(<ManageSywCard />, deps);
    await act(() => wait(0));
    fireEvent.press(await queryByTestId('manage-syw-card-manage-card-button'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(ENV.CITI.LANDING_URL);
  });
});
