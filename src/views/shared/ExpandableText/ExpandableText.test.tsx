import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { renderWithGlobalContext } from '../../../test-utils/renderWithGlobalContext';

import ExpandableText, { Props } from './ExpandableText';
import { act } from 'react-test-renderer';
import { wait } from '../../../utils/wait';
import { Deps } from '../../../models/general';
import { getMockDeps } from '../../../test-utils/getMockDeps';

describe('Expandable Text Component', () => {
  let props: Props;
  let deps: Deps;
  const line = {
    ascender: 1,
    capHeight: 1,
    descender: 1,
    height: 1,
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    width: 1,
    x: 1,
    xHeight: 1,
    y: 1
  };

  const layoutEventAttribute = {
    width: 520,
    height: 70.5,
    x: 0,
    y: 42.5
  };

  beforeEach(() => {
    props = {
      numberOfLines: 3,
      text: 'some text'
    };
    deps = getMockDeps();
  });

  it('should render', async () => {
    const { toJSON } = renderWithGlobalContext(<ExpandableText {...props} />);
    await act(() => wait(0));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the show more button', async () => {
    const layout = {
      nativeEvent: {
        lines: [line, line, line]
      }
    };

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<ExpandableText {...props} />);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onTextLayout', layout);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onLayout', layoutEventAttribute);
    await act(() => wait(0));
    expect(queryByTestId('expandable-text-show-text-pressable')).toBeTruthy();
    expect(getByTestId('expandable-text-show-text-pressable').props.children).toEqual('Show more');
  });

  it('should render the show more button android', async () => {
    deps.nativeHelperService.platform.OS = 'android';
    const layout = {
      nativeEvent: {
        lines: [line, line, line, line]
      }
    };

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<ExpandableText {...props} />, deps);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onTextLayout', layout);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onLayout', layoutEventAttribute);
    await act(() => wait(0));
    expect(queryByTestId('expandable-text-show-text-pressable')).toBeTruthy();
    expect(getByTestId('expandable-text-show-text-pressable').props.children).toEqual('Show more');
  });

  it('should not render the show more button', async () => {
    const layout = {
      nativeEvent: {
        lines: [line, line]
      }
    };

    const { getByTestId, queryByTestId } = renderWithGlobalContext(<ExpandableText {...props} />);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onTextLayout', layout);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onLayout', layoutEventAttribute);
    await act(() => wait(0));
    expect(queryByTestId('expandable-text-show-text-pressable')).toBeFalsy();
  });

  it('should press show more and show less button', async () => {
    const layout = {
      nativeEvent: {
        lines: [line, line, line, line]
      }
    };

    const { getByTestId } = renderWithGlobalContext(<ExpandableText {...props} />);
    await act(() => wait(0));
    fireEvent(getByTestId('expandable-text-text'), 'onTextLayout', layout);
    await act(() => wait(500));
    fireEvent(getByTestId('expandable-text-text'), 'onLayout', layoutEventAttribute);
    await act(() => wait(500));
    fireEvent(getByTestId('expandable-text-show-text-pressable'), 'onPress');
    await act(() => wait(500));
    expect(getByTestId('expandable-text-show-text-pressable').props.children).toEqual('Show less');
    fireEvent(getByTestId('expandable-text-show-text-pressable'), 'onPress');
    await act(() => wait(500));
    expect(getByTestId('expandable-text-show-text-pressable').props.children).toEqual('Show more');
  });
});
