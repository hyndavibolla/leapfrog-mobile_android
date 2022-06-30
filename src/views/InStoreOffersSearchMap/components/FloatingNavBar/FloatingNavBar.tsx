import React, { memo } from 'react';
import { Pressable, StyleProp, TextInput, ViewStyle, ReturnKeyType, Text } from 'react-native';
import { View } from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { ICON, COLOR, FONT_SIZE } from '_constants';
import { ICardLinkOffer } from '_models/cardLink';
import { Icon } from '_commons/components/atoms/Icon';
import { BackButton } from '_commons/components/molecules/Backbutton/BackButton';

import { styles } from './styles';

export interface Props {
  style?: StyleProp<ViewStyle>;
  selectedOffer?: ICardLinkOffer;
  searchValue: string;
  setSearchValue: (string) => void;
  onPressSearch: () => void;
  onSearchFocus?: () => void;
  returnKeyType?: ReturnKeyType;
}

const FloatingNavBar = ({ style, selectedOffer, searchValue, setSearchValue, onPressSearch, onSearchFocus, returnKeyType }: Props) => {
  const { getTestIdProps } = useTestingHelper('floating-nav-bar');
  const { goBack } = useNavigation();

  return (
    <View style={[styles.container, style]}>
      {selectedOffer ? (
        <Pressable style={styles.back} onPress={() => goBack()} {...getTestIdProps('back')}>
          <View style={styles.backButtonWithText}>
            <Icon name={ICON.ARROW_LEFT} color={COLOR.BLACK} />
            <Text style={styles.arrowText} numberOfLines={1}>
              {selectedOffer.brandName}
            </Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.backContainer}>
          <BackButton />
        </View>
      )}
      {!selectedOffer && (
        <View style={styles.search}>
          <Pressable onPress={onPressSearch} {...getTestIdProps('search')}>
            <Icon name={ICON.SEARCH} color={COLOR.BLACK} style={styles.searchIcon} />
          </Pressable>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search by city or zip code"
            placeholderTextColor={COLOR.DARK_GRAY}
            onSubmitEditing={onPressSearch}
            autoCorrect={false}
            autoCompleteType="off"
            autoCapitalize="none"
            style={styles.searchText}
            {...getTestIdProps('input')}
            returnKeyType={returnKeyType}
            onFocus={onSearchFocus}
          />
          {!!searchValue && (
            <Pressable style={styles.closeIcon} onPress={() => setSearchValue('')} {...getTestIdProps('close')}>
              <View style={styles.closeIconBackground}>
                <Icon name={ICON.CLOSE} color={COLOR.WHITE} size={FONT_SIZE.REGULAR} />
              </View>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default memo(FloatingNavBar);
