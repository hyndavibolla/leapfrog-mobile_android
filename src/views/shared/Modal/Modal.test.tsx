import React, { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import Modal from './Modal';
import { Text } from '../Text';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import { GlobalProvider, combinedReducer, getInitialState } from '../../../state-mgmt/GlobalState';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { Deps, IGlobalState } from '../../../models/general';
import { ModalSize, ModalType } from './utils/constants';

describe('Modal', () => {
  let deps: Deps;
  let props: ComponentProps<typeof Modal>;
  let onPressOutside: any;
  let onClose: any;
  let initialState: IGlobalState;

  beforeEach(() => {
    initialState = getInitialState();
    deps = getMockDeps();
    onPressOutside = jest.fn();
    onClose = jest.fn();
    props = {
      visible: true,
      type: ModalType.BOTTOM,
      size: ModalSize.SMALL,
      showCloseButton: true,
      onPressOutside,
      onClose
    };
  });

  it('should render open', () => {
    const { toJSON } = renderWithGlobalContext(
      <Modal {...props}>
        <Text>I am the modal's content</Text>
      </Modal>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it.each(Object.values(ModalType))('should render the %o modal_type', async type => {
    const { toJSON } = renderWithGlobalContext(
      <Modal {...props} type={type}>
        <Text>position is {type}</Text>
      </Modal>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it.each(Object.values(ModalSize))('should render the %o modal_size', async size => {
    const { toJSON } = renderWithGlobalContext(
      <Modal {...props} size={size}>
        <Text>size is {size}</Text>
      </Modal>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render closed', () => {
    const { toJSON } = renderWithGlobalContext(
      <Modal {...props} visible={false}>
        <Text>I am the modal's content</Text>
      </Modal>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should call the on close callback only when closed after being open', () => {
    const { rerender } = render(
      <GlobalProvider deps={deps} initState={initialState} combinedReducers={combinedReducer}>
        <Modal {...props} visible={false} onClose={onClose}>
          <Text>I am the modal's content</Text>
        </Modal>
      </GlobalProvider>
    );
    expect(onClose).not.toBeCalled();
    rerender(
      <GlobalProvider deps={deps} initState={initialState} combinedReducers={combinedReducer}>
        <Modal {...props} onClose={onClose}>
          <Text>I am the modal's content</Text>
        </Modal>
      </GlobalProvider>
    );
    expect(onClose).not.toBeCalled();
    rerender(
      <GlobalProvider deps={deps} initState={initialState} combinedReducers={combinedReducer}>
        <Modal {...props} visible={false} onClose={onClose}>
          <Text>I am the modal's content</Text>
        </Modal>
      </GlobalProvider>
    );
    expect(onClose).toBeCalled();
  });

  it('should have a click outside callback', async () => {
    const { findByTestId } = renderWithGlobalContext(
      <Modal {...props} onPressOutside={onPressOutside}>
        <Text>I am the modal's content</Text>
      </Modal>
    );
    const backdrop = await findByTestId('modal-backdrop');
    fireEvent.press(backdrop);
    expect(onPressOutside).toBeCalled();
  });
});
