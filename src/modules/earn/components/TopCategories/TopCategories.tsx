import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { SectionHeader } from '../SectionHeader';
import { MediumCategoryCard } from '_components/MediumCategoryCard';

import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { MissionModel } from '_models';
import { MissionListType } from '_models/mission';
import { ROUTES } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  data: MissionModel.ICategory[];
  title?: string;
  description?: string;
  seeAllButton?: boolean;
}

const TopCategories = ({ data, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-top-categories');
  const navigation = useNavigation();

  const renderMissionCategoryItem = useMemo(
    () =>
      data.map((category, key) => (
        <View style={styles.categoryItem} key={key}>
          <MediumCategoryCard
            title={category.name}
            backgroundUrl={category.lifestyleUrl}
            onPress={() => {
              navigation.navigate(ROUTES.MISSION_SEE_ALL, {
                searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
                missionListType: MissionListType.DEFAULT,
                initialSearchCriteria: { categoryNameList: [category.name] }
              });
            }}
          />
        </View>
      )),
    [data, navigation]
  );

  return data.length ? (
    <View style={styles.section} {...getTestIdProps('container')}>
      <SectionHeader title={props?.title ?? 'Top Categories'} shouldShowSeeAll={false} seeAllProps={{}} />
      <View style={styles.sectionCategories}>{renderMissionCategoryItem}</View>
    </View>
  ) : null;
};

export default memo(TopCategories);
