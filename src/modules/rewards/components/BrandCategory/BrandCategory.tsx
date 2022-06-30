import React, { memo, useCallback } from 'react';
import { View, TouchableHighlight, FlatList } from 'react-native';

import { Carrousel } from '_components/Carrousel';
import { BrandCategoryItem } from '_modules/rewards/components/BrandCategoryItem/BrandCategoryItem';
import { Title, TitleType } from '_components/Title';
import { Text } from '_components/Text';
import { formatPrettyTitle } from '_utils/formatPrettyTitle';
import { useTestingHelper } from '_utils/useTestingHelper';
import { RewardModel } from '_models';
import { FONT_FAMILY } from '_constants/styles';

import { styles } from './styles';

export interface Props {
  categoryName: string;
  list: RewardModel.IBrand[];
  onPressSeeAll: (categoryName: string) => () => void;
  onPressItem: (rewardBrand: RewardModel.IBrand) => () => void;
}

export const BrandCategory = ({ categoryName, list, onPressSeeAll, onPressItem }: Props) => {
  const { getTestIdProps } = useTestingHelper('category-brand');

  const keyExtractor = useCallback((item: RewardModel.IBrand) => item.id, []);

  return (
    <View key={categoryName} style={styles.sectionContainer} {...getTestIdProps('section')}>
      <View style={styles.sectionHeader}>
        <Title style={styles.sectionTitle} numberOfLines={1} ellipsizeMode="tail" type={TitleType.SECTION}>
          {formatPrettyTitle(categoryName)}
        </Title>

        <TouchableHighlight {...getTestIdProps('see-all-btn')} underlayColor="transparent" onPress={onPressSeeAll(categoryName)}>
          <Text font={FONT_FAMILY.BOLD} style={styles.link}>
            See all
          </Text>
        </TouchableHighlight>
      </View>
      <View style={styles.listContainer}>
        <Carrousel itemWidth={158} separatorWidth={15}>
          <FlatList
            style={styles.list}
            data={list}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => <BrandCategoryItem key={item.id} rewardBrand={item} onPress={onPressItem} />}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </Carrousel>
      </View>
    </View>
  );
};

export default memo(BrandCategory);
