import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { getInitialState, GlobalProvider } from '../state-mgmt/GlobalState';
import { Deps, IGlobalState, IReducer } from '../models/general';
import { getMockDeps } from './getMockDeps';
import { getMockReducer } from './getMockReducer';

export const renderWrappedHook = (
  hookGetter: () => any,
  deps: Deps = getMockDeps(),
  initState: IGlobalState = getInitialState(),
  combinedReducers: IReducer<IGlobalState, any> = getMockReducer()
) => {
  const wrapper = ({ children }: any) => (
    <GlobalProvider deps={deps} initState={initState} combinedReducers={combinedReducers}>
      {children}
    </GlobalProvider>
  );
  return { ...renderHook(() => hookGetter(), { wrapper }), mockReducer: combinedReducers, deps };
};
