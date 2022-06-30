import React from 'react';
import navigation from '@react-navigation/native';
import { ScrollView, View } from 'react-native';
import { waitFor, fireEvent } from '@testing-library/react-native';

import { TutorialElementPosition } from '_commons/models/Tutorial';
import { Tutorial } from '_commons/components/organisms/Tutorial';

import { Deps, IGlobalState } from '_models/general';
import { getInitialState } from '_state_mgmt/GlobalState';
import { renderWithGlobalContext } from '_test_utils/renderWithGlobalContext';
import { getMockDeps } from '_test_utils/getMockDeps';

const mockedNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return { useNavigation: () => ({ navigate: mockedNavigate }) };
});

describe('Tutorial', () => {
  let deps: Deps;
  let initialState: IGlobalState;
  const stepItemParent = new Map<number, any>([[1, { x: 0, y: 0, jsxElement: () => <View testID="parent1" />, isParent: true, style: undefined }]]);
  const stepItems = new Map<number, TutorialElementPosition>([
    [1, { x: 0, y: 0, children: () => <View testID="item1" />, isParent: false, style: undefined }],
    [2, { x: 0, y: 0, children: () => <View testID="item2" />, isParent: false, style: undefined }],
    [3, { x: 0, y: 0, children: () => <View testID="item3" />, isParent: false, style: undefined, parentId: 1 }]
  ]);
  const refElement: any = {
    current: {
      scrollTo: jest.fn()
    }
  };

  beforeEach(() => {
    initialState = getInitialState();
    initialState.core.isTutorialVisible = true;
    deps = getMockDeps();
    navigation.useIsFocused = jest.fn(() => false);
  });

  it('should render with default values', async () => {
    const { toJSON, getByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    await waitFor(() => {
      expect(getByTestId('item1')).toBeTruthy();
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render without step visible', async () => {
    stepItems.set(1, { ...stepItemParent.get(1), isHidden: true });
    const { queryByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    await waitFor(() => {
      expect(queryByTestId('item1')).toBeNull();
    });
  });

  it('should not show items without refElement', async () => {
    const { findByTestId, queryByText } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={null}>
        <ScrollView />
      </Tutorial>,
      deps,
      initialState
    );
    expect(queryByText('item1')).toBeNull();
    fireEvent.press(await findByTestId('tutorial-button-next'));
    expect(queryByText('item1')).toBeNull();
    expect(queryByText('item2')).toBeNull();
    expect(queryByText('item3')).toBeNull();
  });

  it('should change to next item', async () => {
    const { findByTestId, getByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    fireEvent.press(await findByTestId('tutorial-button-next'));
    expect(getByTestId('item2')).toBeTruthy();
  });

  it('should reach the end of the tutorial and call onTutorialEnd', async () => {
    const onTutorialEnd = jest.fn();
    const { findByTestId, getByTestId, queryByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement} onTutorialEnd={onTutorialEnd}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    const buttonNext = await findByTestId('tutorial-button-next');
    fireEvent.press(buttonNext);
    expect(getByTestId('item2')).toBeTruthy();
    fireEvent.press(buttonNext);
    expect(getByTestId('item3')).toBeTruthy();
    fireEvent.press(buttonNext);
    expect(queryByTestId('item1')).toBeNull();
    expect(queryByTestId('item2')).toBeNull();
    expect(queryByTestId('item3')).toBeNull();
    fireEvent.press(buttonNext);
    expect(onTutorialEnd).toBeCalled();
  });

  it('should skip tutorial', async () => {
    const { findByTestId, getByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    fireEvent.press(await findByTestId('tutorial-button-skip'));
    const modal = getByTestId('tutorial-modal');
    expect(modal.findByProps({ visible: false })).toBeTruthy();
  });

  it('should reach the end of the tutorial and not call onTutorialEnd', async () => {
    const onTutorialEnd = jest.fn();
    const { findByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    const buttonNext = await findByTestId('tutorial-button-next');
    fireEvent.press(buttonNext);
    fireEvent.press(buttonNext);
    fireEvent.press(buttonNext);
    fireEvent.press(buttonNext);
    expect(onTutorialEnd).not.toBeCalled();
  });
  it('should skip tutorial and call on skipCallback', async () => {
    const onSkipCallback = jest.fn();
    const { findByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement} onSkipCallback={onSkipCallback}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    fireEvent.press(await findByTestId('tutorial-button-skip'));
    expect(onSkipCallback).toBeCalled();
  });

  it('should not call on skipCallback when user press skip', async () => {
    const onSkipCallback = jest.fn();
    const { findByTestId } = renderWithGlobalContext(
      <Tutorial stepItemParent={stepItemParent} stepItems={stepItems} topHeight={0} refElement={refElement}>
        <ScrollView ref={refElement} />
      </Tutorial>,
      deps,
      initialState
    );
    fireEvent.press(await findByTestId('tutorial-button-skip'));
    expect(onSkipCallback).not.toBeCalled();
  });
});
