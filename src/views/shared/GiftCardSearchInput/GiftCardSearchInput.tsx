import React, { forwardRef, MutableRefObject } from 'react';
import { TextInput, View } from 'react-native';

import { SearchInput } from '_components/SearchInput';
import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR, ICON } from '_constants';
import { noop } from '_utils/noop';
import { styles } from './styles';
import { Icon } from '_commons/components/atoms/Icon';
import { formatPrettyTitle } from '_utils/formatPrettyTitle';

export interface Props {
  text: string;
  categoryIdList: string[];
  onChangeText: (search: string) => void;
  onSubmitText?: () => void;
  onFocusChange?: (isFocused: boolean) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  onFilterPress?: () => void;
}

export const GiftCardSearchInput = (
  { text, categoryIdList, onChangeText, onSubmitText, disabled, onFocusChange, autoFocus, onFilterPress = noop }: Props,
  ref: ((instance: TextInput) => void) | MutableRefObject<TextInput>
) => {
  const { getTestIdProps } = useTestingHelper('gift-card-search-input');

  return (
    <View {...getTestIdProps('container')}>
      <SearchInput
        ref={ref}
        placeholder={categoryIdList[0] ? `Search in ${formatPrettyTitle(categoryIdList[0])}` : 'Search for Rewards'}
        placeholderTextColor={COLOR.WHITE}
        onChange={onChangeText}
        onSubmit={onSubmitText}
        value={text}
        disabled={disabled}
        onFilterPress={onFilterPress}
        filtersActive={categoryIdList.length}
        onFocusChange={onFocusChange}
        autoFocus={autoFocus}
        Icon={<Icon name={ICON.SEARCH} color={COLOR.WHITE} />}
        searchInputStyle={styles.searchInput}
      />
    </View>
  );
};

export default forwardRef<TextInput, Props>(GiftCardSearchInput);
