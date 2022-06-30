import React, { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '_components/Text';
import { ImageWithFallback } from '_components/ImageWithFallback';
import { useTestingHelper } from '_utils/useTestingHelper';
import { FONT_FAMILY, FONT_SIZE, ICON } from '_constants';
import { Icon } from '_commons/components/atoms/Icon';

import { styles } from './styles';

export interface Props {
  image?: string;
  label?: string;
  onPress?: () => void;
  isSelected?: boolean;
}

const CategoryCard = ({ image, label, onPress, isSelected = false }: Props) => {
  const { getTestIdProps } = useTestingHelper('category-card');
  const source = useMemo(() => image && { uri: image }, [image]);
  return (
    <TouchableOpacity {...getTestIdProps('container')} onPress={onPress} style={[styles.container, isSelected && styles.selected]}>
      <View style={styles.mainContainer}>
        <View style={styles.categoryContainer}>
          <ImageWithFallback
            source={source}
            fallbackSource={require('_assets/shared/categoryFallback.png')}
            style={styles.image as any}
            fallbackStyle={styles.fallbackStyle as any}
            {...getTestIdProps('image')}
          />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            font={FONT_FAMILY.BOLD}
            style={[styles.text, isSelected && styles.selectedText]}
            {...getTestIdProps('text')}
          >
            {label}
          </Text>
        </View>
        {isSelected ? <Icon name={ICON.TICK_CIRCLE} size={FONT_SIZE.REGULAR} /> : null}
      </View>
    </TouchableOpacity>
  );
};

export default memo(CategoryCard);
