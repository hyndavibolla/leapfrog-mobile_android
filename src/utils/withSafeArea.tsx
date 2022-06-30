import React, { useMemo } from 'react';
import { StyleSheet, StatusBar, View, SafeAreaView as SafeView, StatusBarStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR } from '_constants';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.WHITE
  },
  container: {
    flex: 1
  },
  statusBar: {
    height: StatusBar.currentHeight
  }
});

type ConfigHeader = {
  onlyBlueStatusBar?: boolean;
  isFixedHeader?: boolean;
  color?: COLOR;
  barStyle?: StatusBarStyle;
};

export const withSafeArea =
  <P extends object>(
    Component: React.ComponentType<P>,
    withHeader: boolean,
    configHeader?: ConfigHeader,
    edges: ReadonlyArray<Edge> = ['top', 'left', 'right', 'bottom']
  ) =>
  (props: P) => {
    configHeader = { onlyBlueStatusBar: false, color: COLOR.PRIMARY_BLUE, ...configHeader };
    const { getTestIdProps } = useTestingHelper('with-safe-area');

    const appStatusBar = useMemo(
      () =>
        configHeader.onlyBlueStatusBar ? (
          <View style={[styles.statusBar, { backgroundColor: configHeader.color }]} {...getTestIdProps('statusbar-blue')}>
            <SafeView>
              <StatusBar translucent backgroundColor={configHeader.color} barStyle={configHeader.barStyle ?? 'light-content'} />
            </SafeView>
          </View>
        ) : (
          <StatusBar translucent backgroundColor={COLOR.TRANSPARENT} barStyle={configHeader.barStyle ?? 'dark-content'} />
        ),
      [getTestIdProps]
    );

    return configHeader.onlyBlueStatusBar || configHeader.isFixedHeader ? (
      <View style={styles.container}>
        {appStatusBar}
        <View style={styles.container}>
          <Component {...(props as P)} />
        </View>
      </View>
    ) : (
      <>
        {appStatusBar}
        <SafeAreaView edges={withHeader ? ['left', 'right', 'bottom'] : edges} style={styles.safeArea} {...getTestIdProps('statusbar-default')}>
          <Component {...(props as P)} />
        </SafeAreaView>
      </>
    );
  };
