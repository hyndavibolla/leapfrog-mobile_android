import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, LinkingOptions, NavigationContainerRef, getStateFromPath } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import { ModalList } from '_components/ModalList';
import { ToastList } from '_components/ToastList';
import { ARCHIVED_ROUTES, COLOR, ENV, ROUTES, ROUTES_CONFIG } from '_constants';
import { RootNavigator } from '_navigation';
import AppStartBehavior from '_state_mgmt/AppStartBehavior';
import { getDeps } from '_state_mgmt/dependencies';
import { GlobalBehavior } from '_state_mgmt/GlobalBehavior';
import { GlobalProvider, combinedReducer, getInitialState } from '_state_mgmt/GlobalState';

(console as any).reportErrorsAsExceptions = false;

const linking: LinkingOptions = {
  prefixes: [ENV.SCHEME, 'https://max.shopyourway.com', 'https://max-sandbox.shopyourway.com'],
  config: ROUTES_CONFIG,
  getStateFromPath: (path, options) => {
    const newPath = ARCHIVED_ROUTES[path] ? ARCHIVED_ROUTES[path] : path;
    return getStateFromPath(newPath, options);
  }
};

const deps = getDeps();
const initialState = getInitialState();

export const AppRoot = () => {
  const ref = useRef<NavigationContainerRef>();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor={COLOR.LIGHT_GRAY} barStyle="dark-content" />
      <GlobalProvider deps={deps} initState={initialState} combinedReducers={combinedReducer}>
        <AppStartBehavior navigationRef={ref}>
          <GlobalBehavior navigationRef={ref}>
            <NavigationContainer ref={ref} linking={linking} initialState={{ routes: [{ name: ROUTES.SPLASH }] }}>
              <RootNavigator />
            </NavigationContainer>
            <ToastList />
            <ModalList />
          </GlobalBehavior>
        </AppStartBehavior>
      </GlobalProvider>
    </>
  );
};
