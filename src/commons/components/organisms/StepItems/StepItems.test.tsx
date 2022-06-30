import React from 'react';
import navigation from '@react-navigation/native';
const {
  RESULTS: { BLOCKED, DENIED, GRANTED }
} = require('react-native-permissions/mock');

import { StepItems } from '_commons/components/organisms/StepItems';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';

import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';
import { fireEvent, waitFor } from '@testing-library/react-native';

import { COLOR } from '_constants/styles';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('StepItems', () => {
  let deps: Deps;
  let initialState: IGlobalState;

  beforeEach(() => {
    deps = getMockDeps();
    initialState = getInitialState();
    navigation.useIsFocused = jest.fn(() => false);
  });

  it('should render with default values', () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(GRANTED);

    const { toJSON, getByTestId } = renderWithGlobalContext(<StepItems step={0} handleNextStep={() => {}} />, deps, initialState);
    expect(getByTestId('step-items-step1')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should not render a step when the step property is out of range', () => {
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(GRANTED);

    const { queryByTestId } = renderWithGlobalContext(<StepItems step={5} handleNextStep={() => {}} />, deps, initialState);
    expect(queryByTestId('step-items-step1')).toBeNull();
  });

  it('should render the location step and activate the location', async () => {
    const handleNextStep = jest.fn();
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(GRANTED);
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<StepItems step={2} handleNextStep={handleNextStep} />, deps, initialState);
    expect(getByTestId('step-items-step3')).toBeTruthy();
    expect(queryByTestId('step-items-notIsLocation')).toBeNull();

    await waitFor(() => {
      fireEvent.press(getByTestId('step-items-step3-action'));
      expect(getByTestId('step-items-step3-isLocation')).toBeTruthy();
      expect(handleNextStep).not.toHaveBeenCalled();
    });
  });

  it('should automatically change step if user does not accept the location permission', async () => {
    const handleNextStep = jest.fn();
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(DENIED);
    const { getByTestId, queryByTestId } = renderWithGlobalContext(<StepItems step={2} handleNextStep={handleNextStep} />, deps, initialState);
    expect(getByTestId('step-items-step3')).toBeTruthy();
    expect(queryByTestId('step-items-notIsLocation')).toBeNull();
    await waitFor(() => {
      fireEvent.press(getByTestId('step-items-step3-action'));
      expect(handleNextStep).toHaveBeenCalled();
    });
  });

  it('should change text and icon color to blocked color if user blocked the location permission', async () => {
    const handleNextStep = jest.fn();
    deps.nativeHelperService.platform.OS = 'android';
    (deps.nativeHelperService.reactNativePermission.check as jest.Mock).mockReturnValue(BLOCKED);
    const { getByTestId } = renderWithGlobalContext(<StepItems step={2} handleNextStep={handleNextStep} />, deps, initialState);
    await waitFor(() => {
      fireEvent.press(getByTestId('step-items-step3-action'));
      expect(getByTestId('step-items-step3-notIsLocation')).toHaveStyle({ color: COLOR.DARK_GRAY });
      expect(getByTestId('icon-text')).toHaveStyle({ color: COLOR.DARK_GRAY });
    });
  });
});
