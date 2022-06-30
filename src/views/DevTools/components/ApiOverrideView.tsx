/* istanbul ignore file */
/** no need to test this dev only component */

import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import JSONTree from 'react-native-json-tree';

import { COLOR, ENV } from '../../../constants';
import { styles } from '../styles';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { useAsyncCallback } from '../../../utils/useAsyncCallback';
import { IApiOverrideRule } from '../../../models/general';
import { Text } from '../../shared/Text';
import { Button } from '../../shared/Button';
import { createUUID } from '../../../utils/create-uuid';
import { safeParse } from '../../../utils/safeParse';
import { Card } from '../../shared/Card';
import CloseWhite from '../../../assets/button/closeWhite.svg';
import { useToast } from '../../../state-mgmt/core/hooks';
import { ToastType } from '../../shared/Toast';
import { wait } from '../../../utils/wait';
import { Modal, ModalSize } from '../../shared/Modal';
import { Accordion } from '../../shared/Accordion';
import { Divider } from '../../shared/Divider';

const apiRulesJson: { label: string; ruleList: IApiOverrideRule[] }[] = require('./apiRules.json'); // tslint:disable-line

export const ApiOverrideView = () => {
  const { deps } = useContext(GlobalContext);
  const { showToast } = useToast();
  const [settingList, setSettingList] = useState<IApiOverrideRule[]>([]);
  const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);

  const [onReloadSettingList, , , savedSettingList] = useAsyncCallback<any, IApiOverrideRule[]>(
    () => deps.nativeHelperService.storage.get(ENV.STORAGE_KEY.API_OVERRIDE_SETTINGS),
    []
  );
  const [onSave, isSaving] = useAsyncCallback(async () => {
    await deps.nativeHelperService.storage.set(
      ENV.STORAGE_KEY.API_OVERRIDE_SETTINGS,
      settingList.map(s => ({ ...s, response: safeParse(s.response) }))
    );
    showToast({ type: ToastType.SUCCESS, children: `Rules (${settingList.length}) saved successfully` });
    await wait(ENV.TOAST_VISIBLE_MS / 2);
  }, [settingList]);

  useEffect(() => setSettingList((savedSettingList || []).map(s => ({ ...s, response: deps.logger.format(s.response) }))), [savedSettingList, deps.logger]);

  const onRemoveRule = (k: string) => setSettingList(prev => prev.filter(({ key }) => key !== k));
  const onAddRule = useCallback(
    (rule: IApiOverrideRule) => {
      setSettingList(prev => [{ ...rule, key: createUUID(), response: deps.logger.format(rule.response) }, ...prev]);
      setAddModalVisible(false);
    },
    [deps.logger]
  );
  const onRuleFieldChange = (index: number, field: keyof IApiOverrideRule, value: any) =>
    setSettingList(prev => [...prev.slice(0, index), { ...prev[index], [field]: value }, ...prev.slice(index + 1, prev.length)]);
  const onSaveAndReload = useCallback(async () => {
    await onSave();
    deps.nativeHelperService.restart();
  }, [onSave, deps.nativeHelperService]);

  useEffect(() => {
    onReloadSettingList();
  }, [onReloadSettingList]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.additionalInfo}>
          IMPORTANT: Note that rules will be applied on the order they are listed below. If more than one rule matches a URl, only the first one will apply.
        </Text>
        <Text style={styles.additionalInfo}>There are {savedSettingList?.length || 0} rule/s active</Text>
      </View>
      <View style={styles.apiOverrideNavContainer}>
        <Button onPress={() => setAddModalVisible(true)}>Add rule</Button>
        <Button containerColor={COLOR.GREEN} onPress={onSaveAndReload} disabled={isSaving}>
          Save & Reload
        </Button>
      </View>
      <ScrollView>
        {settingList.map(({ key, matcher, response, status }, index) => {
          const hasValidJSON = safeParse(response, false);
          return (
            <Card key={key} style={styles.logItemContainer}>
              <View style={styles.apiOverrideItemContainer}>
                <View style={styles.apiOverrideMainConfigContainer}>
                  <Button innerContainerStyle={{ backgroundColor: COLOR.RED, height: 30, width: 30 }} textColor={COLOR.WHITE} onPress={() => onRemoveRule(key)}>
                    <CloseWhite />
                  </Button>
                  <View style={styles.apiOverrideControlContainer}>
                    <Text>URL matcher (RegExp)</Text>
                    <TextInput
                      style={styles.textInput}
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={matcher}
                      placeholder="url matcher"
                      onChangeText={text => onRuleFieldChange(index, 'matcher', text)}
                    />
                  </View>
                  <View style={styles.apiOverrideControlContainer}>
                    <Text>status</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        (() => {
                          if (status <= 100 || status >= 600) return { backgroundColor: COLOR.DARK_GRAY, color: COLOR.WHITE };
                          if (status >= 200 && status < 400) return { backgroundColor: COLOR.GREEN, color: COLOR.WHITE };
                          if (status >= 400 && status < 600) return { backgroundColor: COLOR.RED, color: COLOR.WHITE };
                          return { backgroundColor: COLOR.WHITE, color: COLOR.BLACK };
                        })()
                      ]}
                      autoCorrect={false}
                      autoCapitalize="none"
                      value={String(status)}
                      placeholder="status code"
                      onChangeText={text => onRuleFieldChange(index, 'status', Number(text) || 0)}
                    />
                  </View>
                </View>
                <View>
                  <Text>Response body</Text>
                  <TextInput
                    style={[styles.textInput, !hasValidJSON && { backgroundColor: COLOR.RED, color: COLOR.WHITE }]}
                    value={response}
                    autoCorrect={false}
                    autoCapitalize="none"
                    numberOfLines={10}
                    multiline={true}
                    placeholder="response body"
                    onChangeText={text => onRuleFieldChange(index, 'response', text)}
                  />

                  {!hasValidJSON ? null : (
                    <>
                      <Text>Preview</Text>
                      <JSONTree hideRoot={true} data={safeParse(response)} />
                    </>
                  )}
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
      <Modal visible={isAddModalVisible} onClose={() => setAddModalVisible(false)} size={ModalSize.EXTRA_LARGE} style={styles.modal}>
        <ScrollView style={{ margin: 15, width: '100%' }}>
          {apiRulesJson.map(({ label, ruleList }, index) => (
            <View key={label} style={{ marginBottom: 30 }}>
              <Accordion title={label} startsOpen={!index} wrapperStyle={{ flex: 1 }}>
                <View>
                  {ruleList.map((rule, ruleListIndex) => (
                    <Card key={ruleListIndex} style={styles.logItemContainer}>
                      <View style={{ padding: 15 }}>
                        <Text>{rule.description}</Text>
                        <Divider />
                        <Text style={styles.additionalInfo}>status code: {rule.status}</Text>
                        <Text style={styles.additionalInfo}>url matcher: "{rule.matcher}"</Text>
                        <View style={{ marginVertical: 15 }}>
                          <JSONTree hideRoot={true} data={rule.response} />
                        </View>
                        <Button onPress={() => onAddRule(rule)}>Add</Button>
                      </View>
                    </Card>
                  ))}
                </View>
              </Accordion>
            </View>
          ))}
        </ScrollView>
      </Modal>
    </View>
  );
};

export default memo(ApiOverrideView);
