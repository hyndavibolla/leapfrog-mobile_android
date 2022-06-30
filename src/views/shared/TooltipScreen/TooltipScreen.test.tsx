import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { wait } from '../../../utils/wait';
import TooltipScreen, { Props } from './TooltipScreen';

describe('TooltipScreen', () => {
  let props: Props;
  beforeEach(() => {
    props = {
      onComplete: jest.fn(),
      stepList: [
        {
          title: 'title 1',
          subtitle: 'subtitle 1',
          text: 'text 1',
          imageSrc: 1
        },
        {
          title: 'title 2',
          subtitle: 'subtitle 2',
          text: 'text 2',
          imageSrc: 2
        }
      ],
      step: 0
    };
  });

  it('should render', () => {
    const { toJSON, deps } = renderWithGlobalContext(<TooltipScreen {...props} />);
    expect(deps.eventTrackerService.tealiumSDK.trackView).not.toBeCalled();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should track views when configured', async () => {
    props.stepList[0].trackingRouteName = 'view 1';
    props.stepList[1].trackingRouteName = 'view 2';
    const { deps } = renderWithGlobalContext(<TooltipScreen {...props} />);
    await wait(0);
    expect(deps.eventTrackerService.tealiumSDK.trackView).toBeCalledWith('view 1', expect.anything());
  });

  it('should change steps', () => {
    const { getAllByTestId, getByTestId, queryByTestId, deps } = renderWithGlobalContext(<TooltipScreen {...props} />);
    expect(queryByTestId('tooltip-screen-step-0-active')).toBeTruthy();
    fireEvent.press(getAllByTestId('tooltip-screen-next-btn')[0]);
    act(() => {
      getByTestId('tooltip-screen-container').props.onScroll({
        nativeEvent: { contentOffset: { x: deps.nativeHelperService.dimensions.getWindowWidth() } }
      }); // scrolling event needs to be manually trigger for the test to work
    });
    expect(queryByTestId('tooltip-screen-step-0-active')).not.toBeTruthy();
    expect(queryByTestId('tooltip-screen-step-1-active')).toBeTruthy();
    expect(props.onComplete).not.toBeCalled();
  });

  it('should complete', () => {
    const { getAllByTestId, getByTestId, deps } = renderWithGlobalContext(<TooltipScreen {...props} />);
    expect(props.onComplete).not.toBeCalled();
    fireEvent.press(getByTestId('tooltip-screen-next-btn'));
    act(() => {
      getByTestId('tooltip-screen-container').props.onScroll({
        nativeEvent: { contentOffset: { x: deps.nativeHelperService.dimensions.getWindowWidth() } }
      }); // scrolling event needs to be manually trigger for the test to work
    });
    expect(props.onComplete).toBeCalledTimes(0);
    fireEvent.press(getByTestId('tooltip-screen-next-btn'));
    act(() => {
      getByTestId('tooltip-screen-container').props.onScroll({
        nativeEvent: { contentOffset: { x: deps.nativeHelperService.dimensions.getWindowWidth() } }
      }); // scrolling event needs to be manually trigger for the test to work
    });
    expect(props.onComplete).toBeCalledTimes(1);
    fireEvent.press(getAllByTestId('tooltip-screen-close-btn')[0]);
    expect(props.onComplete).toBeCalledTimes(2);
  });
});
