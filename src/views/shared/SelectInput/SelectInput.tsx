import React, { memo, useCallback, useState, useMemo, useRef, useContext } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import { Picker } from '@react-native-community/picker';

import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { useTestingHelper } from '../../../utils/useTestingHelper';
import { Input } from '../Input';
import { styles } from './styles';
import { Button } from '../Button';
import { COLOR } from '_constants';
import { isDeepEqual } from '../../../utils/isDeepEqual';

export interface IOption {
  label: string;
  value: string;
}

export interface Props {
  optionList: IOption[];
  selectedOption: IOption;
  onChange: (option: IOption) => void;
  isInvalid?: boolean;
  placeholder?: string;
  sheetContainerStyle?: ViewStyle;
}

export default memo(({ optionList, selectedOption, onChange, isInvalid, placeholder, sheetContainerStyle }: Props) => {
  const { getTestIdProps } = useTestingHelper('select-input');
  const { deps } = useContext(GlobalContext);
  const sheetRef = useRef<ScrollBottomSheet<any>>();
  const [innerOption, setOptionValue] = useState<IOption>();
  const windowHeight = deps.nativeHelperService.dimensions.getWindowHeight();
  const isAndroid = deps.nativeHelperService.platform.OS === 'android';
  const delayScrollBottomSheet = isAndroid ? 200 : 0;

  const onOptionValueChange = useCallback(
    (value: number | string) => {
      setOptionValue(optionList.find(o => o.value === value));
    },
    [optionList]
  );
  const showPicker = useCallback(() => {
    if (!selectedOption?.value && optionList[0]) onOptionValueChange(optionList[0]?.value);
    if (!innerOption?.value && selectedOption?.value) onOptionValueChange(selectedOption.value);
    setTimeout(() => sheetRef?.current?.snapTo(0));
  }, [selectedOption, optionList, onOptionValueChange, innerOption]);
  const hidePicker = useCallback(() => setTimeout(() => sheetRef?.current?.snapTo(1), delayScrollBottomSheet), [delayScrollBottomSheet]); // timeouts are workarounds for the ScrollBottomSheet dependency
  const onCancel = useCallback(() => {
    hidePicker();
    setOptionValue(selectedOption);
  }, [hidePicker, selectedOption]);
  const onConfirm = useCallback(() => {
    hidePicker();
    onChange(innerOption);
  }, [onChange, hidePicker, innerOption]);
  const snapPoints = useMemo(() => ['50%', windowHeight], [windowHeight]);

  /* istanbul ignore next line */
  const renderHandle = useCallback(() => null, []);

  return (
    <>
      <Input
        value={!selectedOption?.label ? '' : String(selectedOption.label)}
        onPressIn={showPicker}
        isInvalid={isInvalid}
        placeholder={placeholder}
        showSoftInputOnFocus={false}
        {...getTestIdProps('input')}
      />
      <ScrollBottomSheet
        ref={sheetRef}
        containerStyle={[{ height: windowHeight }, styles.shadowContainer, sheetContainerStyle] as any}
        componentType="ScrollView"
        snapPoints={snapPoints}
        initialSnapIndex={1}
        renderHandle={renderHandle}
        enableOverScroll={false}
      >
        <View style={{ height: windowHeight / 2 }}>
          <View style={styles.container}>
            <View style={styles.btnContainer}>
              <Button
                compatibilityMode={isAndroid}
                containerColor={COLOR.TRANSPARENT}
                textStyle={styles.cancelText}
                onPress={onCancel}
                {...getTestIdProps('cancel')}
              >
                Cancel
              </Button>
              <Button
                compatibilityMode={isAndroid}
                containerColor={COLOR.TRANSPARENT}
                textStyle={styles.confirmText}
                onPress={onConfirm}
                {...getTestIdProps('confirm')}
              >
                Done
              </Button>
            </View>
            <View>
              {deps.nativeHelperService.platform.select({
                ios: (
                  <Picker selectedValue={innerOption?.value} onValueChange={onOptionValueChange} {...getTestIdProps('picker')}>
                    {optionList.map(item => (
                      <Picker.Item key={item.value} label={item.label} value={item.value} {...getTestIdProps('picker-item')} />
                    ))}
                  </Picker>
                ),
                android: (
                  <ScrollView contentContainerStyle={styles.androidPickerContainer}>
                    {optionList.map(item => (
                      <Button
                        compatibilityMode={isAndroid}
                        containerColor={COLOR.TRANSPARENT}
                        key={item.value}
                        textStyle={isDeepEqual(item, innerOption) ? styles.activeOptionText : styles.optionText}
                        onPress={() => onOptionValueChange(item.value)}
                        {...getTestIdProps('picker-item')}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </ScrollView>
                )
              })}
            </View>
          </View>
        </View>
      </ScrollBottomSheet>
    </>
  );
});
