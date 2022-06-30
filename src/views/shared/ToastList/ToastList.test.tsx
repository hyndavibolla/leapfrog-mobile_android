import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import ToastList, { Props } from './ToastList';
import { ToastType } from '../Toast/Toast';
import { wait } from '../../../utils/wait';
import { ENV } from '../../../constants';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getInitialState } from '../../../state-mgmt/GlobalState';
import { IGlobalState } from '../../../models/general';

describe('ToastList', () => {
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    props = {};
  });

  it('should render all items one at a time', async () => {
    const { toJSON } = renderWithGlobalContext(<ToastList {...props} />, undefined, {
      ...initialState,
      core: {
        ...initialState.core,
        toastList: [
          { key: '1', props: { type: ToastType.SUCCESS, title: 'FIRST', children: 'some text' } },
          { key: '2', props: { type: ToastType.WARNING, title: 'SECOND', children: 'some other text' } }
        ]
      }
    });
    expect(toJSON()).toMatchSnapshot();
    await act(() => wait(ENV.TOAST_VISIBLE_MS));
    expect(toJSON()).toMatchSnapshot();
    await act(() => wait(ENV.TOAST_VISIBLE_MS));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should close on press', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<ToastList {...props} />, undefined, {
      ...initialState,
      core: {
        ...initialState.core,
        toastList: [{ key: '1', props: { type: ToastType.ERROR, title: 'Error' } }]
      }
    });
    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId('toast-container'));
    expect(toJSON()).toMatchSnapshot();
  });
});
