import React from 'react';
import { waitFor } from '@testing-library/react-native';

import { PrivacyPolicy } from '_views/PrivacyPolicy';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';

describe('PrivacyPolicy', () => {
  let deps: Deps;

  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should render', async () => {
    deps.httpService.fetch = jest.fn().mockResolvedValueOnce({ text: jest.fn().mockResolvedValueOnce('content') });

    const { toJSON } = renderWithGlobalContext(<PrivacyPolicy />, deps);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should render CriticalError when an error ocurred', async () => {
    deps.httpService.fetch = jest.fn().mockRejectedValueOnce('error');

    const { findByTestId } = renderWithGlobalContext(<PrivacyPolicy />, deps);
    expect(await findByTestId('critical-error-container')).toBeTruthy();
  });
});
