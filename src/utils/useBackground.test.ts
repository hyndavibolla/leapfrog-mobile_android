import { NativeEventSubscription } from 'react-native';
import { act } from '@testing-library/react-native';

import { Deps } from '../models/general';
import { getMockDeps } from '../test-utils/getMockDeps';
import { renderWrappedHook } from '../test-utils/renderWrappedHook';
import { noop } from './noop';

import { useBackground } from './useBackground';
import { wait } from './wait';

describe('useBackground', () => {
  let deps: Deps;
  beforeEach(() => {
    deps = getMockDeps();
  });

  it('should callback when app goes to background', async () => {
    deps.nativeHelperService.appState.currentState = 'active';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      wait(0).then(() => fn('background'));
      return { remove: noop };
    };
    const cb = jest.fn();
    renderWrappedHook(() => useBackground(cb), deps);
    expect(cb).not.toBeCalled();
    await act(() => wait(0));
    expect(cb).toBeCalledTimes(1);
  });

  it('should NOT callback when app does not go to background', async () => {
    deps.nativeHelperService.appState.currentState = 'background';
    deps.nativeHelperService.appState.addEventListener = (_, fn): NativeEventSubscription => {
      fn('active');
      return { remove: noop };
    };
    const cb = jest.fn();
    renderWrappedHook(() => useBackground(cb), deps);
    await act(() => wait(0));
    expect(cb).not.toBeCalled();
  });
});
