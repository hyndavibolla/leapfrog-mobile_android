import { act } from '@testing-library/react-native';

import { Deps } from '_models/general';
import { getMockDeps } from '_test_utils/getMockDeps';
import { renderWrappedHook } from '_test_utils/renderWrappedHook';
import { EarnSectionsData } from '_modules/earn/screens/EarnMain/constants';

import { useEarnSections } from './useEarnSections';

describe('useEarnSections', () => {
  let deps: Deps;
  beforeEach(() => {
    deps = getMockDeps();
    deps.remoteConfigService.getValue = jest.fn().mockReturnValueOnce(undefined);
  });

  it('if remote config is undefined and cache value is empty should return default config', async () => {
    deps.remoteConfigService.getImmediateValue = (() => []) as any;
    const { result } = renderWrappedHook(() => useEarnSections(), deps);
    await act(async () => {
      const res = await result.current[0]();
      expect(res).toEqual(EarnSectionsData.sections);
    });
  });

  it('should return visible sections from cache config', async () => {
    const remoteConfig = [EarnSectionsData.sections[0], { ...EarnSectionsData.sections[1], visible: false }];
    deps.remoteConfigService.getImmediateValue = (() => remoteConfig) as any;
    const { result } = renderWrappedHook(() => useEarnSections(), deps);
    await act(async () => {
      const res = await result.current[0]();
      const filteredRemoteConfig = [EarnSectionsData.sections[0]];
      expect(res).toEqual(filteredRemoteConfig);
    });
  });

  it('should return visible sections from remote config', async () => {
    const remoteConfig = [EarnSectionsData.sections[0], { ...EarnSectionsData.sections[1], visible: false }];
    deps.remoteConfigService.getValue = (async () => remoteConfig) as any;
    const { result } = renderWrappedHook(() => useEarnSections(), deps);
    await act(async () => {
      const res = await result.current[0]();
      const filteredRemoteConfig = [EarnSectionsData.sections[0]];
      expect(res).toEqual(filteredRemoteConfig);
    });
  });

  it('should NOT fail when process gets rejected', async () => {
    deps.remoteConfigService.getValue = Promise.reject;
    const { result } = renderWrappedHook(() => useEarnSections(), deps);
    await act(async () => {
      await result.current[0]();
      expect(deps.logger.error).toBeCalled();
    });
  });
});
