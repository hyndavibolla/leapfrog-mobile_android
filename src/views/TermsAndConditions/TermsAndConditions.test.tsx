import React from 'react';
import { act } from 'react-test-renderer';

import { TermsAndConditions } from './TermsAndConditions';
import { renderWithGlobalContext } from '../../test-utils/renderWithGlobalContext';
import { wait } from '../../utils/wait';
import { getMockDeps } from '../../test-utils/getMockDeps';

describe('TermsAndConditions', () => {
  it('should render loading', async () => {
    const deps = getMockDeps();
    let resolve;
    const pendingPromise = new Promise(r => {
      resolve = r;
    });
    deps.httpService.fetch = jest.fn().mockReturnValue(pendingPromise);
    const { toJSON } = renderWithGlobalContext(<TermsAndConditions />, deps);
    expect(toJSON()).toMatchSnapshot();
    resolve();
    await act(() => wait(0));
  });

  it('should render', async () => {
    const deps = getMockDeps();
    deps.httpService.fetch = jest.fn().mockResolvedValue({ text: () => Promise.resolve('Terms and conditions text') });
    const { toJSON } = renderWithGlobalContext(<TermsAndConditions />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with error', async () => {
    const deps = getMockDeps();
    deps.httpService.fetch = Promise.reject;
    const { queryByTestId } = renderWithGlobalContext(<TermsAndConditions />, deps);
    await act(() => wait(0));
    expect(queryByTestId('critical-error-container')).toBeTruthy();
  });
});
