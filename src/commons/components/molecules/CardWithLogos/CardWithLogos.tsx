import React, { memo, useContext, useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { TextRoundAvatar } from '_commons/components/molecules/TextRoundAvatar';
import { BrandLogo } from '_components/BrandLogo';
import { Text } from '_components/Text';
import { ICON } from '_constants';
import { COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '_constants/styles';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

const SMALL_DEVICES_LIMIT = 1;
const LIMIT = 3;
const SMALL_DEVICES_PLUS_INDEX = 1;
const PLUS_INDEX = 2;

export interface Props {
  title: string;
  logos: string[];
  onPress?: () => void;
}

const CardWithLogos = ({ title, logos, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('card-with-logos');

  const {
    deps: {
      nativeHelperService: {
        dimensions: { isSmallDevice }
      }
    }
  } = useContext(GlobalContext);

  const shouldCut = useMemo(() => {
    if (isSmallDevice) return logos.length > SMALL_DEVICES_LIMIT;
    return logos.length > LIMIT;
  }, [isSmallDevice, logos.length]);

  const plusCountIndex = useMemo(() => {
    if (isSmallDevice) return SMALL_DEVICES_PLUS_INDEX;
    return PLUS_INDEX;
  }, [isSmallDevice]);

  const renderItem: ListRenderItem<string> = ({ item: logo, index }) => {
    if (shouldCut && index > plusCountIndex) return null;
    if (shouldCut && index === plusCountIndex)
      return (
        <View {...getTestIdProps('counter')}>
          <TextRoundAvatar value={`${logos.length - plusCountIndex}+`} textSize={FONT_SIZE.PETITE} font={FONT_FAMILY.SEMIBOLD} style={styles.itemSpacing} />
        </View>
      );
    return (
      <View {...getTestIdProps('item')}>
        <BrandLogo
          style={[styles.item, index > 0 && styles.itemSpacing]}
          image={logo}
          fallbackIcon={<Icon name={ICON.GIFT_CIRCLE} size={'36px' as FONT_SIZE} color={COLOR.PINK} />}
        />
      </View>
    );
  };

  const renderContent = (
    <>
      <Text color={COLOR.BLACK} font={FONT_FAMILY.BOLD} lineHeight={LINE_HEIGHT.MEDIUM} {...getTestIdProps('title')}>
        {title}
      </Text>
      <FlatList
        contentContainerStyle={styles.itemsContainer}
        data={logos}
        renderItem={renderItem}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );

  /* istanbul ignore next line */
  const activeOpacity = useMemo(() => (onPress ? 0.2 : 1), [onPress]);

  return (
    <TouchableOpacity activeOpacity={activeOpacity} style={styles.cardContainer} onPress={onPress} {...getTestIdProps('pressable-container')}>
      {renderContent}
    </TouchableOpacity>
  );
};

export default memo(CardWithLogos);
