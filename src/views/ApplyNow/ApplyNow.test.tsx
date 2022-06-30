import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { act } from 'react-test-renderer';

import { Deps, IGlobalState } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { ApplyNow, Props } from './ApplyNow';
import { wait } from '_utils/wait';
import { ROUTES, ENV } from '_constants';
import { getInitialState } from '_state_mgmt/GlobalState';

describe('Apply Now', () => {
  let props: Props;
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    props = {
      navigation: { navigate: jest.fn() } as any
    };
  });

  it('should render', async () => {
    deps.nativeHelperService.platform.OS = 'ios';
    const { toJSON, queryByTestId } = renderWithGlobalContext(<ApplyNow {...props} />, deps);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
    expect(queryByTestId('apply-now-non-ecm-content')).toBeTruthy();
  });

  it('should show details modal', async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<ApplyNow {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('apply-now-see-details-link'));
    expect(queryByTestId('apply-now-details-modal-content')).toBeTruthy();
    fireEvent.press(getByTestId('modal-backdrop'));
  });

  it('should navigate to fusion webview', async () => {
    const route = { params: { routeToReturn: ROUTES.MAIN_TAB.WALLET } };
    const { getByTestId } = renderWithGlobalContext(<ApplyNow {...props} />);
    await act(() => wait(0));
    fireEvent.press(getByTestId('apply-now-apply-btn'));
    expect(props.navigation.navigate).toBeCalledWith(expect.any(String), route.params);
  });

  it('should navigate to SYW web', async () => {
    initialState.game.current.memberships.userHasSywCard = false;
    const { getByTestId } = renderWithGlobalContext(<ApplyNow {...props} />, deps, initialState);
    await act(() => wait(0));
    fireEvent.press(getByTestId('apply-now-see-details-link'));
    fireEvent.press(getByTestId('apply-now-card-link'));
    expect(deps.nativeHelperService.linking.openURL).toBeCalledWith(ENV.FUSION.APPLY_NOW_URI);
  });
});
