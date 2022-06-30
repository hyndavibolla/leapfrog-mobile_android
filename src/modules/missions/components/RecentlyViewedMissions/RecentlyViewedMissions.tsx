import React, { memo, useContext, useCallback } from 'react';
import { View, FlatList } from 'react-native';

import ErrorBoundary from '_components/ErrorBoundary';
import { MediumMissionCard } from '_modules/missions/components/MediumMissionCard';
import { MissionImpressionView } from '_modules/missions/components/MissionImpressionView';
import { Carrousel } from '_components/Carrousel';

import { useTestingHelper } from '_utils/useTestingHelper';
import { isAvailableStreakIndicator } from '_utils/isAvailableStreakIndicator';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { MissionModel, OfferModel } from '_models';
import { IMission } from '_models/mission';
import { ButtonCreativeType } from '_models/general';
import { MissionListType } from '_models/mission';

import { SectionHeader } from '_modules/earn/components/SectionHeader';
import { styles } from './styles';

export interface Props {
  data: IMission[];
  setMissionItemRef: (uuid: string, ref: View) => void;
  itemOnPress: (mission: IMission, isAvailableStreakIndicator?: boolean) => void;
  viewedMissionList: string[];
  onScrollEnd: () => void;
  missionItemUuidPrefix: string;
  listType: MissionListType;
  title?: string;
  description?: string;
  seeAllButton?: boolean;
}

const RecentlyViewedMissions = ({ data, setMissionItemRef, itemOnPress, viewedMissionList, onScrollEnd, missionItemUuidPrefix, listType, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-recently-viewed-missions');
  const { state, deps } = useContext(GlobalContext);
  const { missionSearchMap } = state.mission;

  const getMissionItemUuid = useCallback((mission: MissionModel.IMission, prefix: string) => `${prefix};${mission.uuid}`, []);
  const keyExtractor = useCallback((item: MissionModel.IMission) => item.uuid, []);

  const shouldShowStreakIndicator = useCallback(
    (mission: MissionModel.IMission) => mission.pointsAwarded.conditions.some(condition => condition.programType === OfferModel.ProgramType.STREAK),
    []
  );

  const renderItem = useCallback(
    ({ item: mission }: { item: MissionModel.IMission }) => (
      <View
        collapsable={false}
        ref={itemRef => setMissionItemRef(getMissionItemUuid(mission, missionItemUuidPrefix), itemRef)}
        {...getTestIdProps(`${missionItemUuidPrefix}-item`)}
      >
        <MissionImpressionView
          hasStreakTag={isAvailableStreakIndicator(mission)}
          streakIndicator={shouldShowStreakIndicator(mission)}
          missionCardComponent={MediumMissionCard}
          mission={mission}
          onPress={itemOnPress}
          wasViewed={viewedMissionList.includes(getMissionItemUuid(mission, missionItemUuidPrefix))}
          creativeType={ButtonCreativeType.CAROUSEL}
        />
      </View>
    ),
    [itemOnPress, viewedMissionList, setMissionItemRef, getMissionItemUuid, shouldShowStreakIndicator, getTestIdProps, missionItemUuidPrefix]
  );

  return data.length ? (
    <ErrorBoundary>
      <View style={styles.sectionMain} {...getTestIdProps('section-container')}>
        {missionSearchMap[listType]?.length ? (
          <SectionHeader title={props?.title ?? state.mission.missionListTitleMap[listType]} shouldShowSeeAll={false} />
        ) : null}
        <Carrousel itemWidth={160} separatorWidth={12}>
          <FlatList
            contentContainerStyle={styles.topBrandCarrousel}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            horizontal
            removeClippedSubviews
            initialNumToRender={4}
            updateCellsBatchingPeriod={150}
            maxToRenderPerBatch={6}
            ItemSeparatorComponent={ItemSeparatorComponent}
            ListFooterComponentStyle={styles.listContainerEnd}
            onMomentumScrollEnd={onScrollEnd}
            onScrollEndDrag={deps.nativeHelperService.platform.select({ ios: onScrollEnd, default: onScrollEnd })}
            scrollEventThrottle={10}
            {...getTestIdProps('section-horizontal-scroll')}
          />
        </Carrousel>
      </View>
    </ErrorBoundary>
  ) : null;
};

const ItemSeparatorComponent = /* istanbul ignore next */ () => <View style={styles.itemSeparator} />;

export default memo(RecentlyViewedMissions);
