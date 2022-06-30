import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { Deps, IGlobalState, ISailthruMessage } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { getMockDeps } from '_test_utils/getMockDeps';
import { getNewOnMaxMessage_1 } from '_test_utils/entities';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { createUUID } from '_utils/create-uuid';
import NewOnMax, { Props } from './NewOnMax';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  __esModule: true,
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('NewOnMax', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    props = {
      focusKey: createUUID()
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<NewOnMax {...props} />);
    await waitFor(() => expect(toJSON()).toMatchSnapshot());
  });

  it('should log a error when tap a new on max card without ctaRoute', async () => {
    const newOnMaxMessage: ISailthruMessage = { ...getNewOnMaxMessage_1() };
    newOnMaxMessage.custom.ctaRoute = undefined;
    deps.nativeHelperService.sailthru.getMessages = jest.fn().mockResolvedValueOnce([newOnMaxMessage]);

    const { findAllByTestId } = renderWithGlobalContext(<NewOnMax {...props} />, deps, initialState);

    fireEvent.press((await findAllByTestId('new-on-max-card-action-btn'))[0]);
    expect(mockNavigate).not.toBeCalled();
    expect(deps.logger.error).toBeCalled();
  });

  it('should navigate to route when tap a new on max card with ctaRoute', async () => {
    const newOnMaxMessage: ISailthruMessage = { ...getNewOnMaxMessage_1() };
    deps.nativeHelperService.sailthru.getMessages = jest.fn().mockResolvedValueOnce([newOnMaxMessage]);

    const { findAllByTestId } = renderWithGlobalContext(<NewOnMax {...props} />, deps, initialState);

    fireEvent.press((await findAllByTestId('new-on-max-card-action-btn'))[0]);
    expect(mockNavigate).toBeCalledWith(newOnMaxMessage.custom.ctaRoute);
  });

  it('should render after horizontal scrolling', async () => {
    const { toJSON, getAllByTestId, findByTestId } = renderWithGlobalContext(<NewOnMax {...props} />, deps, initialState);

    expect(await findByTestId('earn-main-new-on-max-container')).toBeTruthy();
    fireEvent(getAllByTestId('earn-main-new-on-max-horizontal-scroll')[0], 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 80
        },
        contentSize: {
          width: 500
        },
        layoutMeasurement: {
          width: 500
        }
      }
    });
    fireEvent(getAllByTestId('earn-main-new-on-max-horizontal-scroll')[0], 'momentumScrollEnd');
    expect(toJSON()).toMatchSnapshot();
  });
});
