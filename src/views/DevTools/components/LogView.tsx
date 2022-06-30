/* istanbul ignore file */
/** no need to test this dev only component */

import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, View, TouchableHighlight, TextInput } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import moment from 'moment';
import { Picker } from '@react-native-community/picker';
import JSONTree from 'react-native-json-tree';
import { writeFile, DocumentDirectoryPath, TemporaryDirectoryPath } from 'react-native-fs';
import Share from 'react-native-share';

import { styles } from '../styles';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { getLogSettingsDefault, ILogHistoryItem, ILogSettings, LogMethod } from '../../../services/Logger';
import { Text } from '../../shared/Text';
import { Card } from '../../shared/Card';
import { COLOR, ENV, FONT_FAMILY } from '../../../constants';
import { Accordion } from '../../shared/Accordion';
import { Divider } from '../../shared/Divider';
import { ToastType } from '../../shared/Toast';
import { useToast } from '../../../state-mgmt/core/hooks';
import { Button } from '../../shared/Button';
import { useDebounce } from '../../../utils/useDebounce';
import { isObject } from '../../../utils/isDeepEqual';
import { useAsyncCallback } from '../../../utils/useAsyncCallback';
import { wait } from '../../../utils/wait';

const recursiveSearch = (item: any, regex: RegExp): boolean => {
  if (isObject(item)) for (const key in item) if (recursiveSearch(item[key], regex)) return true;
  if (['number', 'string'].includes(typeof item)) return regex.test(String(item));
  return false;
};

export const LogView = () => {
  const { deps, state } = useContext(GlobalContext);
  const { showToast } = useToast();
  const [levelSelected, setLevelSelected] = useState<LogMethod>(null);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search, 500);
  const logHistory = deps.logger.getLogHistoryList();
  const [onGetLogSettings, , , logSettings] = useAsyncCallback<any, ILogSettings>(() => deps.nativeHelperService.storage.get(ENV.STORAGE_KEY.LOG_SETTINGS), []);
  const [logSettingsState, setLogSettingsState] = useState<ILogSettings>(getLogSettingsDefault());
  const list = useMemo(
    () => [
      { level: LogMethod.DEBUG, key: Date.now().toString(), logList: ['current app state', state], timestamp: Date.now() } as ILogHistoryItem,
      ...logHistory.filter(
        ({ level, logList }) => (!levelSelected || level === levelSelected) && (!debouncedSearch || recursiveSearch(logList, new RegExp(debouncedSearch, 'i')))
      )
    ],
    [levelSelected, debouncedSearch, logHistory, state]
  );

  const renderItem = useCallback(({ item }: { item: ILogHistoryItem }) => <LogItem {...item} showToast={showToast} />, [showToast]);
  const keyExtractor = useCallback(({ key }: ILogHistoryItem) => key, []);
  const onPress = useCallback(async () => {
    try {
      const log = JSON.stringify(list, null, 2);
      Clipboard.setString(log);
      const path = deps.nativeHelperService.platform.select({
        android: `${TemporaryDirectoryPath}/SYW-log-${Date.now()}.json`,
        ios: `${DocumentDirectoryPath}/SYW-log-${Date.now()}.json`
      });
      deps.logger.info('Storing log file onto directory:', path);
      await writeFile(path, log, 'utf8');
      const options = {
        message: 'Save the file',
        title: 'Export',
        url: `file://${path}`,
        content: 'application/json'
      };
      try {
        await Share.open(options);
      } catch (e) {
        deps.logger.warn('Presumed share sheet unexpected result:', e.toString());
      }
      showToast({
        type: ToastType.SUCCESS,
        title: 'Logs copied to clipboard and saved into a file',
        children: `"${levelSelected || 'all'}" logs copied successfully.`
      });
    } catch (error) {
      deps.logger.error(error);
      showToast({ type: ToastType.ERROR, title: 'Error exporting log' });
    }
  }, [list, deps.nativeHelperService.platform, deps.logger, showToast, levelSelected]);

  const onPressToken = useCallback(async () => {
    const tokenSet = await deps.apiService.getTokenSetAsync();
    Clipboard.setString(tokenSet.accessToken);
    showToast({
      type: ToastType.SUCCESS,
      title: 'Access Token copied to clipboard'
    });
  }, [deps.apiService, showToast]);

  useEffect(() => {
    onGetLogSettings();
  }, [onGetLogSettings]);

  useEffect(() => setLogSettingsState(prev => logSettings || prev), [logSettings]);

  const toggleLogLevel = (level: LogMethod) =>
    setLogSettingsState(prev => ({
      ...prev,
      ignoredLogMethodList: (prev.ignoredLogMethodList.includes(level)
        ? prev.ignoredLogMethodList.filter(l => l !== level)
        : [...prev.ignoredLogMethodList, level]
      ).sort()
    }));
  const onMaxCharsChange = useCallback((text: string) => setLogSettingsState(prev => ({ ...prev, argMaxLength: Number(text) || 0 })), []);
  const [onSave, isSaving] = useAsyncCallback(async () => {
    await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.LOG_SETTINGS, logSettingsState);
    showToast({ type: ToastType.SUCCESS, children: 'Log settings saved successfully' });
    await wait(ENV.TOAST_VISIBLE_MS / 2);
  }, [logSettingsState]);
  const onSaveAndReload = useCallback(async () => {
    await onSave();
    deps.nativeHelperService.restart();
  }, [onSave, deps.nativeHelperService]);

  return (
    <View style={styles.container}>
      <View style={styles.generalInfoContainer}>
        <Text style={styles.additionalInfo}>
          displaying {list.length - 1} {list.length - 1 !== logHistory.length ? `(of ${logHistory.length})` : ''}
        </Text>
      </View>
      <View style={{ marginHorizontal: -5 }}>
        <Accordion title="Logging Settings" startsOpen={false}>
          <View>
            <Text>Max chars on terminal logs (0 equals no limit)</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TextInput value={String(logSettingsState.argMaxLength)} onChangeText={onMaxCharsChange} style={styles.textInput} keyboardType="numeric" />
            </View>
            <Divider />
            <Text>Choose which log levels are visible from terminal</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 10 }}>
              {Object.values(LogMethod).map(level => (
                <Button
                  onPress={() => toggleLogLevel(level)}
                  containerColor={logSettingsState.ignoredLogMethodList.includes(level) ? COLOR.DARK_GRAY : COLOR.PRIMARY_BLUE}
                  key={level}
                >
                  {level}
                </Button>
              ))}
            </View>
          </View>
          <Divider />
          <Button containerColor={COLOR.GREEN} onPress={onSaveAndReload} disabled={isSaving}>
            Save & Reload
          </Button>
        </Accordion>
      </View>
      <View style={styles.listContainer}>
        <View style={styles.navContainer}>
          <TextInput value={search} onChangeText={setSearch} style={[styles.textInput, { flex: 1 }]} placeholder="Search in logs" />
          <Picker style={styles.levelPicker} itemStyle={styles.levelPickerItem} selectedValue={levelSelected} onValueChange={setLevelSelected as any}>
            <Picker.Item label="all" value={null} />
            {Object.values(LogMethod).map(level => (
              <Picker.Item key={level} label={level} value={level} />
            ))}
          </Picker>
          <Button onPress={onPress}>📋</Button>
          <Button onPress={onPressToken}>🔑</Button>
        </View>
        <FlatList data={list} renderItem={renderItem} keyExtractor={keyExtractor} ListEmptyComponent={<Text>No items</Text>} />
      </View>
    </View>
  );
};

const LogItem = memo(({ level, timestamp, logList, showToast }: ILogHistoryItem & { showToast: Function }) => {
  const textColorMap = {
    [LogMethod.INFO]: COLOR.WHITE,
    [LogMethod.DEBUG]: COLOR.WHITE,
    [LogMethod.WARN]: COLOR.BLACK,
    [LogMethod.ERROR]: COLOR.WHITE
  };
  const backgroundColorMap = {
    [LogMethod.INFO]: COLOR.PRIMARY_BLUE,
    [LogMethod.DEBUG]: COLOR.ORANGE,
    [LogMethod.WARN]: COLOR.PRIMARY_YELLOW,
    [LogMethod.ERROR]: COLOR.RED
  };
  const onPress = useCallback(() => {
    Clipboard.setString(JSON.stringify(logList, null, 2));
    showToast({ type: ToastType.SUCCESS, title: 'Log item copied to clipboard', children: `"${level}" log copied successfully` });
  }, [logList, showToast, level]);
  return (
    <Card style={styles.logItemContainer}>
      <View style={[styles.logItemHeader, { backgroundColor: backgroundColorMap[level] }]}>
        <View style={styles.logItemCopyContainer}>
          <TouchableHighlight underlayColor="transparent" onPress={onPress}>
            <View style={styles.logItemCopyIcon}>
              <Text style={[styles.logItemHeaderText, styles.logItemIconText]}>📋</Text>
            </View>
          </TouchableHighlight>
          <Text font={FONT_FAMILY.BOLD} style={[styles.logItemHeaderText, { color: textColorMap[level] }]}>
            {level.toUpperCase()} ({logList.length})
          </Text>
        </View>
        <Text font={FONT_FAMILY.BOLD} style={[styles.logItemHeaderText, { color: textColorMap[level] }]}>
          {moment(timestamp).format('HH:mm:ss.SSS')}
        </Text>
      </View>
      <View style={styles.logItemContent}>
        <Accordion title="" startsOpen={true} wrapperStyle={{ width: '100%' }}>
          {logList.map((log, index) => (
            <React.Fragment key={index}>
              <JSONTree hideRoot={true} data={log || ''} />
              {index === logList.length - 1 ? null : <Divider />}
            </React.Fragment>
          ))}
        </Accordion>
      </View>
    </Card>
  );
});

export default memo(LogView);
