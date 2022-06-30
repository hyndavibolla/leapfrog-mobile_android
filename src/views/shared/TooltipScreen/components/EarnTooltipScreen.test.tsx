import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { TooltipKey } from '../../../../models/general';

import { renderWithGlobalContext } from '../../../../test-utils/renderWithGlobalContext';
import { wait } from '../../../../utils/wait';
import EarnTooltipScreen, { Props } from './EarnTooltipScreen';

describe('EarnTooltipScreen', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      navigation: { goBack: jest.fn() } as any,
      route: { params: undefined }
    };
  });

  it('should render', () => {
    const { toJSON } = renderWithGlobalContext(<EarnTooltipScreen {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should complete', async () => {
    const { getAllByTestId, deps } = renderWithGlobalContext(<EarnTooltipScreen {...props} />);
    fireEvent.press(getAllByTestId('tooltip-screen-close-btn')[0]);
    expect(deps.logger.debug).toBeCalledWith('setViewedTooltipList', { key: TooltipKey.EARN });
    expect(props.navigation.goBack).toBeCalled();
    await act(() => wait(0));
  });
});
