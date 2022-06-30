import React, { ReactElement } from 'react';
import { render } from '@testing-library/react-native';

import { getInitialState, GlobalProvider } from '../state-mgmt/GlobalState';
import { Deps, IGlobalState, IReducer } from '../models/general';
import { getMockDeps } from './getMockDeps';
import { getMockReducer } from './getMockReducer';

export const renderWithGlobalContext = (
  children: ReactElement,
  deps: Deps = getMockDeps(),
  initState: IGlobalState = getInitialState(),
  combinedReducers: IReducer<IGlobalState, any> = getMockReducer()
) => {
  const renderAPI = render(
    <GlobalProvider deps={deps} initState={initState} combinedReducers={combinedReducers}>
      {children}
    </GlobalProvider>
  );
  return { ...renderAPI, mockReducer: combinedReducers, deps };
};
