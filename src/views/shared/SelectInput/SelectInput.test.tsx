import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { Deps } from '../../../models/general';
import { getMockDeps } from '../../../test-utils/getMockDeps';
import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';
import SelectInput, { Props } from './SelectInput';

describe('SelectInput', () => {
  console.error = () => null; // ref warn because of "react-native-scroll-bottom-sheet" mock which is needed for testing
  let props: Props;
  let deps: Deps;
  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      selectedOption: { value: '1', label: 'one' },
      optionList: [
        { value: '1', label: 'one' },
        { value: '2', label: 'two' },
        { value: '3', label: 'three' }
      ],
      isInvalid: false,
      placeholder: 'placeholder text'
    };
    deps = getMockDeps();
  });

  it('it should render', () => {
    const { toJSON } = renderWithGlobalContext(<SelectInput {...props} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('it should render invalid', () => {
    const { toJSON } = renderWithGlobalContext(<SelectInput {...props} isInvalid={true} selectedOption={null} />, deps);
    expect(toJSON()).toMatchSnapshot();
  });

  it('it should NOT pick a value when canceled', () => {
    deps.nativeHelperService.platform.select = config => config.ios;
    const { getByTestId } = renderWithGlobalContext(<SelectInput {...props} />, deps);
    fireEvent(getByTestId('select-input-input'), 'onPressIn');
    fireEvent(getByTestId('select-input-picker'), 'onValueChange', { value: '2', label: 'two' });
    fireEvent.press(getByTestId('select-input-cancel'));
    expect(props.onChange).not.toBeCalled();
  });

  it('it should confirm first value on the list when no interaction was made and no value was passed', () => {
    deps.nativeHelperService.platform.select = config => config.ios;
    const { getByTestId } = renderWithGlobalContext(<SelectInput {...props} selectedOption={null} />, deps);
    fireEvent(getByTestId('select-input-input'), 'onPressIn');
    fireEvent.press(getByTestId('select-input-confirm'));
    expect(props.onChange).toBeCalledWith({ value: '1', label: 'one' });
  });

  it('it should confirm the previously selected value when no interaction was made', () => {
    deps.nativeHelperService.platform.select = config => config.ios;
    const { getByTestId } = renderWithGlobalContext(<SelectInput {...props} selectedOption={{ value: '2', label: 'two' }} />, deps);
    fireEvent(getByTestId('select-input-input'), 'onPressIn');
    fireEvent.press(getByTestId('select-input-confirm'));
    expect(props.onChange).toBeCalledWith({ value: '2', label: 'two' });
  });

  it('it should pick a value on ios', () => {
    deps.nativeHelperService.platform.select = config => config.ios;
    const { getByTestId } = renderWithGlobalContext(<SelectInput {...props} />, deps);
    fireEvent(getByTestId('select-input-input'), 'onPressIn');
    fireEvent(getByTestId('select-input-picker'), 'onValueChange', '2');
    fireEvent.press(getByTestId('select-input-confirm'));
    expect(props.onChange).toBeCalledWith({ value: '2', label: 'two' });
  });

  it('it should pick a value on android', () => {
    deps.nativeHelperService.platform.select = config => config.android;
    const { getByTestId, getAllByTestId } = renderWithGlobalContext(<SelectInput {...props} />, deps);
    fireEvent(getByTestId('select-input-input'), 'onPressIn');
    fireEvent.press(getAllByTestId('select-input-picker-item')[1]);
    fireEvent.press(getByTestId('select-input-confirm'));
    expect(props.onChange).toBeCalledWith({ value: '2', label: 'two' });
  });

  it('should render a RNGestureHandlerButton when then OS is android', () => {
    deps.nativeHelperService.platform.OS = 'android';
    deps.nativeHelperService.platform.select = config => config.android;
    const { getByTestId, getAllByTestId, toJSON } = renderWithGlobalContext(<SelectInput {...props} />, deps);
    const cancelButton = getByTestId('select-input-cancel');
    const confirmButton = getByTestId('select-input-confirm');
    const pickerItemButton = getAllByTestId('select-input-picker-item');

    expect(cancelButton.type).toBe('RNGestureHandlerButton');
    expect(confirmButton.type).toBe('RNGestureHandlerButton');
    expect(pickerItemButton[1].type).toBe('RNGestureHandlerButton');
    expect(toJSON()).toMatchSnapshot();
  });
});
