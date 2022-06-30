import React, { memo, useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';

import { Card } from '_components/Card';
import { Text } from '_components/Text';
import { COLOR, FONT_FAMILY, LINE_HEIGHT } from '_constants';
import { formatNumber } from '_utils/formatNumber';
import { getDecimals } from '_utils/getNumberListFromRange';
import { noop } from '_utils/noop';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  value: string;
  max?: number;
  optionList?: number[];
  valid?: boolean;
  freeSelection?: boolean;
  disabled?: boolean;
  label?: string;
  errorLabel?: string;
  onChange: (value: string) => void;
  onMoveScroll: () => void;
}

export const NumberListInput = ({
  value,
  max = 999.99,
  optionList = [],
  onChange,
  freeSelection = false,
  disabled,
  label,
  errorLabel,
  valid,
  onMoveScroll
}: Props) => {
  const [innerValue, setInnerValue] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>('');
  const distinctOptionList = useMemo(() => Array.from(new Set(optionList)).map(option => getDecimals(option)), [optionList]);

  const { getTestIdProps } = useTestingHelper('gift-card-input');

  const inputRef = useRef<TextInput>();
  const [isFocused, setIsFocused] = useState(false);
  const flatListRef = useRef<FlatList>();

  const onChangeInput = useCallback((parsedValue: string, isFromCard: boolean) => {
    if (isFromCard) setInputValue('');
    else setInputValue(parsedValue);
  }, []);

  const onValueChange = useCallback(
    (item: number | string, isFromCard?: boolean) => {
      item = String(item).replace('$', '');
      if (disabled || parseFloat(item) > max) return;

      const decimalChar = '.';
      const cleanItem = item.replace(/,/g, decimalChar);
      const firstDecimalCharIndex = String(cleanItem).indexOf(decimalChar);
      const parsedValue = cleanItem
        .split('')
        .filter(
          (digit, index, list) =>
            /** only allows non number when there is a decimal char and it's the first occurrence */
            (!isNaN(digit as any) || (digit === decimalChar && (index === firstDecimalCharIndex || index === list.length - 1))) &&
            /** truncating to 2 decimals */
            (firstDecimalCharIndex === -1 || index <= firstDecimalCharIndex + 2)
        )
        .join('');

      if (isNaN(Number(parsedValue))) return;

      /** number changed internally only (decimal char related cases) */
      if (parsedValue.charAt(parsedValue.length - 1) === decimalChar || parsedValue === String(value)) {
        onChangeInput(parsedValue, isFromCard);
        return setInnerValue(parsedValue);
      }
      onChangeInput(parsedValue, isFromCard);
      onChange(parsedValue);
    },
    [disabled, max, onChange, onChangeInput, value]
  );

  const onOptionChange = useCallback(() => {
    if (!optionList.length) return; // you shouldn't try to programmatically scroll an empty flat list
    /** index is the exact item to scroll to while fallbackIndex is one close when no exact match is found */
    const index = optionList.indexOf(Number(value));
    const fallbackIndex = optionList.findIndex(option => option > Number(value));
    flatListRef.current.scrollToIndex({
      animated: true,
      /** - 1 centers the items since there are usually 3. This can be improved by finding out how many items are really visible at a time */
      index: Math.max(0, (index !== -1 ? index : fallbackIndex) - 1)
    });
  }, [value, optionList]);

  useEffect(onOptionChange, [onOptionChange]);
  useEffect(() => setInnerValue(value), [value]);

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const selected = Number(innerValue) === Number(item);
      return (
        <TouchableOpacity style={styles.item} onPress={() => onValueChange(item, true)} {...getTestIdProps('option')} disabled={disabled}>
          <Card style={[styles.card, selected && styles.cardSelected, disabled && styles.disabledCardStyle]}>
            <Text
              font={FONT_FAMILY.BOLD}
              lineHeight={LINE_HEIGHT.BIG}
              style={[styles.itemText, selected && styles.itemTextSelected, disabled && styles.disabledTextStyle]}
              {...getTestIdProps('option-value')}
            >
              $ {formatNumber(item)}
            </Text>
          </Card>
        </TouchableOpacity>
      );
    },
    [disabled, getTestIdProps, innerValue, onValueChange]
  );

  /* istanbul ignore next */ const inputFocusStyle = isFocused ? styles.inputTextFocused : null;
  const inputInvalidStyle = !valid ? styles.inputTextInvalid : null;
  const inputTextPlaceholderStyle = inputValue ? styles.inputText : styles.inputTextPlaceholder;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Gift Card amount</Text>
      <FlatList
        ref={flatListRef}
        onScrollToIndexFailed={noop}
        style={styles.list}
        data={distinctOptionList}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={String}
        onLayout={onOptionChange}
        ListFooterComponent={<View style={styles.listEnd} />}
      />
      {freeSelection && (
        <>
          <Text style={[styles.label, styles.labelInput]}>or enter a custom value </Text>
          <View style={styles.inputContainer}>
            <Text style={[styles.inputText, styles.inputTextIcon]}>$</Text>
            <TextInput
              style={[styles.inputTextContainer, inputTextPlaceholderStyle, inputFocusStyle, inputInvalidStyle, disabled && styles.disabledInputTextStyle]}
              placeholder={label}
              placeholderTextColor={COLOR.DARK_GRAY}
              editable={freeSelection && !disabled}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={onValueChange}
              returnKeyType="done"
              ref={inputRef}
              selectionColor={COLOR.PRIMARY_BLUE}
              onFocus={() => {
                setIsFocused(inputRef?.current?.isFocused());
                onMoveScroll();
              }}
              onBlur={() => setIsFocused(inputRef?.current?.isFocused())}
              {...getTestIdProps('input')}
            />
          </View>
          {!valid && (
            <Text style={styles.labelError} {...getTestIdProps('error-label')}>
              {errorLabel}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default memo(NumberListInput);
