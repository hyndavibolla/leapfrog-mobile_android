import React from 'react';
import { act } from 'react-test-renderer';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { SurveyDetail, Props } from './SurveyDetail';
import { wait } from '_utils/wait';
import { actions } from '_state_mgmt/core/actions';

describe('SurveyDetail', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      route: { params: { surveyUri: 'survey-uri.com' } },
      navigation: { navigate: jest.fn(), addListener: jest.fn().mockReturnValue(jest.fn()) } as any
    };
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<SurveyDetail {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should show a toast when loading ends', async () => {
    const { deps, getByTestId } = renderWithGlobalContext(<SurveyDetail {...props} />);
    await act(() => wait(0));
    await act(async () => getByTestId('survey-detail-webview').props.onLoad());
    expect(deps.logger.debug).toBeCalledWith('showToast', expect.anything());
  });

  it('should show a confirmation modal if the user skip the survey', async () => {
    const preventDefault = jest.fn();
    const unsubscribe = jest.fn();
    props.navigation.addListener = jest.fn((str, fn) => {
      fn({ preventDefault });
      return unsubscribe;
    }) as any;
    const { mockReducer, unmount } = renderWithGlobalContext(<SurveyDetail {...props} />);
    await act(() => wait(0));
    expect(props.navigation.addListener).toBeCalledWith('beforeRemove', expect.anything());
    expect(mockReducer).toBeCalledWith(expect.any(Object), actions.addModal(expect.any(String), expect.any(Object)));
    unmount();
    await act(() => wait(0));
    expect(unsubscribe).toBeCalled();
  });
});
