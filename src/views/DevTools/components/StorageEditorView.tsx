/* istanbul ignore file */
/** no need to test this dev only component */

import { useFocusEffect } from '@react-navigation/core';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import JSONTree from 'react-native-json-tree';

import { COLOR, ENV } from '_constants';
import { useToast } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { Button } from '_components/Button';
import { Text } from '_components/Text';
import { ToastType } from '_components/Toast';
import { Accordion } from '_components/Accordion';
import { safeParse } from '_utils/safeParse';
import { useAsyncCallback } from '_utils/useAsyncCallback';
import { wait } from '_utils/wait';

import { styles } from '../styles';

export const StorageEditorView = () => {
  const { deps } = useContext(GlobalContext);
  const { showToast } = useToast();
  const [onGetStorage, , , storageValue] = useAsyncCallback<any, [string, string][]>(
    async () =>
      Promise.all(Object.values(ENV.STORAGE_KEY).map(key => deps.nativeHelperService.storage.get(key).then(value => [key, JSON.stringify(value, null, 2)]))),
    []
  );
  const [storageMap, setStorageMap] = useState<Record<string, string>>({});

  const onChange = (key: string, value: string) => setStorageMap(prev => ({ ...prev, [key]: value }));

  const [onSave, isSaving] = useAsyncCallback(async () => {
    await Promise.all(Object.entries(storageMap).map(([key, value]) => deps.nativeHelperService.storage.set(key, safeParse(value))));
    showToast({ type: ToastType.SUCCESS, children: 'Storage saved successfully' });
    await wait(ENV.TOAST_VISIBLE_MS / 2);
  }, [storageMap]);

  const onSaveAndReload = useCallback(async () => {
    await onSave();
    deps.nativeHelperService.restart();
  }, [onSave, deps.nativeHelperService]);

  useEffect(() => setStorageMap((storageValue || []).reduce((total, [key, value]) => ({ ...total, [key]: value }), {})), [storageValue]);

  useFocusEffect(
    useCallback(() => {
      onGetStorage();
    }, [onGetStorage])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.additionalInfo}>
        IMPORTANT: Note this is a super destructive feature when used carelessly. Be sure to know what you are doing before pressing that save button.
      </Text>
      <View style={[styles.apiOverrideNavContainer, { justifyContent: 'flex-end' }]}>
        <Button containerColor={COLOR.GREEN} onPress={onSaveAndReload} disabled={isSaving}>
          Save & Reload
        </Button>
      </View>
      <ScrollView>
        {Object.entries(storageMap).map(([key, value]) => {
          const invalid = Symbol();
          const parsed = safeParse<any>(value, invalid);
          const hasValidJSON = parsed !== invalid;
          return (
            <View key={key} style={{ marginVertical: 10 }}>
              <Accordion title={key} wrapperStyle={{ flex: 1 }} startsOpen={false}>
                <TextInput
                  style={[styles.textInput, { marginVertical: 10 }, !hasValidJSON && { backgroundColor: COLOR.RED, color: COLOR.WHITE }]}
                  value={value}
                  autoCorrect={false}
                  autoCapitalize="none"
                  numberOfLines={10}
                  multiline={true}
                  placeholder="value"
                  onChangeText={textValue => onChange(key, textValue)}
                />

                {!hasValidJSON || [null, undefined].includes(parsed /** JSON tree limitation */) ? null : (
                  <>
                    <Text>Preview</Text>
                    <JSONTree hideRoot={true} data={parsed} />
                  </>
                )}
                <Button innerContainerStyle={{ backgroundColor: COLOR.RED, marginTop: 10 }} textColor={COLOR.WHITE} onPress={() => onChange(key, 'null')}>
                  Remove
                </Button>
              </Accordion>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default memo(StorageEditorView);
