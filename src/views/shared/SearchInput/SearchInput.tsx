import React, { MutableRefObject, ReactNode, useCallback, useRef, forwardRef, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, StyleProp, ViewStyle, ColorValue, TextStyle } from 'react-native';

import { Button } from '_components/Button';
import { Text } from '_components/Text';
import { Icon as IconToShow } from '_commons/components/atoms/Icon';

import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR, colorWithOpacity, CONTAINER_STYLE, ICON } from '_constants';
import FilterIcon from '_assets/shared/filterIcon.svg';
import FilterIconActive from '_assets/shared/filterIconActive.svg';

import { styles } from './styles';

export interface Props {
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  value: string;
  onChange: (value: string) => void;
  onFilterPress?: () => void;
  onSubmit?: () => void;
  filtersActive?: number | null;
  hideFilters?: boolean;
  disabled?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  Icon?: ReactNode;
  searchContainerStyle?: StyleProp<ViewStyle>;
  searchInputStyle?: StyleProp<TextStyle>;
  autoFocus?: boolean;
  cursorColor?: string;
  backgroundColor?: string;
}

function SearchInput(
  {
    placeholder,
    placeholderTextColor,
    value,
    onChange,
    onFilterPress,
    filtersActive,
    disabled,
    onSubmit,
    hideFilters,
    onFocusChange,
    Icon = <IconToShow name={ICON.SEARCH} color={COLOR.WHITE} />,
    searchContainerStyle,
    searchInputStyle,
    autoFocus,
    cursorColor = COLOR.DARK_GRAY,
    backgroundColor = COLOR.BLUE_NAVIGATION
  }: Props,
  ref: ((instance: TextInput) => void) | MutableRefObject<TextInput>
) {
  const { getTestIdProps } = useTestingHelper('search-input');
  const inputRef = useRef<TextInput>();
  const getRef = useCallback(() => (ref as MutableRefObject<TextInput>) || inputRef, [ref]);
  const handleOnChange = useCallback((text: string) => !disabled && onChange(text), [disabled, onChange]);
  const handleOnFilterPress = useCallback(() => !disabled && onFilterPress && onFilterPress(), [disabled, onFilterPress]);
  const handleFocusChange = useCallback(() => onFocusChange && onFocusChange(getRef()?.current?.isFocused()), [onFocusChange, getRef]);

  const onIconPress = /* istanbul ignore next */ () => {
    if (getRef()?.current?.isFocused()) getRef()?.current.blur();
    else getRef()?.current.focus();
  };
  const onFocus = useCallback(/* istanbul ignore next */ () => getRef().current?.focus(), [getRef]);

  const showPlaceholder = useMemo(() => {
    return value === undefined || value === '';
  }, [value]);

  return (
    <TouchableOpacity activeOpacity={1} onPress={onFocus}>
      <View style={styles.container}>
        <View style={[CONTAINER_STYLE.shadow, styles.searchContainer, { backgroundColor }, disabled && styles.disabled, searchContainerStyle]}>
          <TouchableOpacity onPress={onIconPress}>{Icon}</TouchableOpacity>
          <View style={styles.inputContainer}>
            <TextInput
              ref={getRef()}
              autoFocus={autoFocus}
              editable={!disabled}
              style={[styles.searchInput, searchInputStyle]}
              value={value}
              onChangeText={handleOnChange}
              returnKeyType="go"
              onSubmitEditing={onSubmit}
              onFocus={handleFocusChange}
              onBlur={handleFocusChange}
              selectionColor={cursorColor}
              numberOfLines={1}
              {...getTestIdProps('input')}
            />
            {showPlaceholder && (
              <Text style={[styles.placeholder, searchInputStyle, { color: placeholderTextColor || colorWithOpacity(COLOR.BLACK, 30) }]} numberOfLines={1}>
                {placeholder}
              </Text>
            )}
          </View>
        </View>

        {hideFilters ? null : (
          <Button
            onPress={handleOnFilterPress}
            innerContainerStyle={[CONTAINER_STYLE.shadow, styles.filterContainer, { backgroundColor }, filtersActive && styles.filterContainerActive]}
            {...getTestIdProps('filter-btn')}
          >
            {!filtersActive ? <FilterIcon color={COLOR.WHITE} /> : <FilterIconActive color={COLOR.WHITE} />}
          </Button>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default forwardRef<TextInput, Props>(SearchInput);
