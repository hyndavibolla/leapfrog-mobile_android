import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { BoxCard, Props } from './BoxCard';
import { wait } from '_utils/wait';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { Deps } from '_models/general';

describe('BoxCard', () => {
  let deps: Deps;
  let props: Props;

  beforeEach(() => {
    deps = getMockDeps();
    props = {
      title: 'CARD NUMBER',
      value: 'LLC3 3GB9 FAR4 UHK'
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<BoxCard {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should execute copyToClipboard when copy button is clicked', async () => {
    const { queryByTestId } = renderWithGlobalContext(<BoxCard {...props} showCopy />, deps);
    fireEvent.press(queryByTestId('box-card-copy'));
    await act(() => wait(0));
    expect(deps.nativeHelperService.clipboard.setString).toHaveBeenCalledWith('LLC3 3GB9 FAR4 UHK');
  });

  it('should show copied check when copy button is clicked & showCheckOnCopy is true', async () => {
    const { queryByTestId } = renderWithGlobalContext(<BoxCard {...props} showCopy showCheckOnCopy />, deps);
    fireEvent.press(queryByTestId('box-card-copy'));
    expect(deps.nativeHelperService.clipboard.setString).toHaveBeenCalledWith('LLC3 3GB9 FAR4 UHK');
    await act(() => wait(0));
    expect(queryByTestId('box-card-copied')).toBeTruthy();
  });
});
