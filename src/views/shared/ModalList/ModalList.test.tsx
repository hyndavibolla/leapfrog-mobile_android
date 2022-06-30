import React from 'react';
import { act } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';

import ModalList, { Props } from './ModalList';
import { wait } from '../../../utils/wait';
import { ENV } from '../../../constants';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { getInitialState } from '../../../state-mgmt/GlobalState';
import { IGlobalState } from '../../../models/general';

describe('ModalList', () => {
  let props: Props;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    props = {};
  });

  it('should render all items one at a time', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(<ModalList {...props} />, undefined, {
      ...initialState,
      core: {
        ...initialState.core,
        modalList: [
          { key: '1', props: { children: 'some text' } },
          { key: '2', props: { children: 'some other text' } }
        ]
      }
    });
    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId('modal-backdrop'));
    await act(() => wait(ENV.MODAL_PADDING_MS));
    expect(toJSON()).toMatchSnapshot();
    fireEvent.press(getByTestId('modal-backdrop'));
    await act(() => wait(ENV.MODAL_PADDING_MS));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call on close and on press outside callbacks', async () => {
    const onClose = jest.fn();
    const onPressOutside = jest.fn();
    const { getByTestId } = renderWithGlobalContext(<ModalList {...props} />, undefined, {
      ...initialState,
      core: {
        ...initialState.core,
        modalList: [{ key: '1', props: { children: 'some text', onClose, onPressOutside } }]
      }
    });
    fireEvent.press(getByTestId('modal-backdrop'));
    await act(() => wait(ENV.MODAL_PADDING_MS));
    expect(onPressOutside).toBeCalled();
    expect(onClose).toBeCalled();
  });
});
