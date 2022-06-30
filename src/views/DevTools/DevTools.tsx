/* istanbul ignore file */
/** no need to test this dev only component */

import React, { memo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ROUTES } from '../../constants';
import LogView from './components/LogView';
import ApiOverrideView from './components/ApiOverrideView';
import StorageEditorView from './components/StorageEditorView';
import { shouldShowFeature } from '_components/Flagged';
import { FeatureFlag } from '../../models/general';
import StorybookUIRoot from '../../../storybook';

const { Navigator, Screen } = createMaterialTopTabNavigator();

export const DevTools = () => {
  return (
    <Navigator>
      <Screen name={ROUTES.DEV_TOOLS_TAB.LOG} component={LogView} options={{ title: 'Logs' }} />
      {shouldShowFeature(FeatureFlag.API_OVERRIDE) && (
        <Screen name={ROUTES.DEV_TOOLS_TAB.API_OVERRIDE} component={ApiOverrideView} options={{ title: 'API Override' }} />
      )}
      <Screen name={ROUTES.DEV_TOOLS_TAB.STORAGE} component={StorageEditorView} options={{ title: 'Storage Editor' }} />
      <Screen name={ROUTES.DEV_TOOLS_TAB.STORYBOOK} component={StorybookUIRoot} options={{ title: 'Storybook' }} />
    </Navigator>
  );
};

export default memo(DevTools);
