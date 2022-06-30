import React, { memo } from 'react';
import { View, ScrollView, TouchableHighlight, ViewStyle } from 'react-native';

import { CategoryCard } from '_components/CategoryCard';
import { Text } from '_components/Text';
import { Button } from '_components/Button';

import { useTestingHelper } from '_utils/useTestingHelper';

import { ICategory } from '_models/mission';

import { FONT_FAMILY } from '_constants/styles';

import { styles } from './styles';

export interface Props {
  categoryList: ICategory[];
  selectedNameList: string[];
  onToggle: (categoryName: string) => void;
  onClearAll: () => void;
  onApply: () => void;
  style?: ViewStyle;
}

function CategoryList({ categoryList, onToggle, selectedNameList, onClearAll, onApply, style }: Props) {
  const { getTestIdProps } = useTestingHelper('category-list');

  return (
    <View style={[styles.container, style]}>
      <View style={styles.headerContainer}>
        <Text font={FONT_FAMILY.BOLD} style={styles.title}>
          FILTERS
        </Text>
        <TouchableHighlight underlayColor="transparent" onPress={onClearAll} {...getTestIdProps('clear-all')}>
          <Text font={FONT_FAMILY.BOLD} style={styles.clearBtn}>
            Clear all
          </Text>
        </TouchableHighlight>
      </View>
      <ScrollView>
        <View style={styles.categoryContainer}>
          {categoryList.map(({ name, imageUrl }) => (
            <View style={styles.categoryItem} key={name}>
              <CategoryCard image={imageUrl} label={name} isSelected={selectedNameList.includes(name)} onPress={() => onToggle(name)} />
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <Button innerContainerStyle={styles.innerButton} textStyle={styles.buttonText} onPress={onApply} {...getTestIdProps('apply')}>
          Apply
        </Button>
      </View>
    </View>
  );
}

export default memo(CategoryList);
