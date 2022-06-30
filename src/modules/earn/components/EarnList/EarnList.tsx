import React, { memo, useContext, useCallback, useMemo } from 'react';
import { View, FlatList, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ErrorBoundary from '_components/ErrorBoundary';
import { Carrousel } from '_components/Carrousel';
import { PetiteMissionCard } from '_components/PetiteMissionCard';
import { SmallMissionCard } from '_components/SmallMissionCard';
import { MediumMissionCard } from '_modules/missions/components/MediumMissionCard';
import { LargeMissionCard } from '_components/LargeMissionCard';
import { CPAMissionCard } from '_modules/missions/components/CPAMissionCard';
import { SectionHeader } from '../SectionHeader';
import { MissionImpressionView } from '_modules/missions/components/MissionImpressionView';

import { useTestingHelper } from '_utils/useTestingHelper';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';

import { MissionModel, OfferModel } from '_models';
import { IMission } from '_models/mission';
import { ButtonCreativeType } from '_models/general';
import { MissionListType } from '_models/mission';
import { ROUTES, ENV } from '_constants';

import { styles } from './styles';

export interface Props {
  data: IMission[];
  setMissionItemRef: (uuid: string, ref: View) => void;
  itemOnPress: (mission: IMission, isAvailableStreakIndicator?: boolean) => void;
  viewedMissionList: string[];
  onScrollEnd: () => void;
  missionItemUuidPrefix: string;
  missionCardComponent: typeof PetiteMissionCard | typeof SmallMissionCard | typeof MediumMissionCard | typeof LargeMissionCard | typeof CPAMissionCard;
  listType: MissionListType;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemWidth?: number;
  sectionHeaderTitle?: string;
  headerShouldShowSeeAll?: boolean;
  showHeaderOnPress?: boolean;
  title?: string;
  description?: string;
  seeAllButton?: boolean;
}

const MissionList = ({
  data,
  setMissionItemRef,
  itemOnPress,
  viewedMissionList,
  onScrollEnd,
  missionItemUuidPrefix,
  missionCardComponent,
  listType,
  itemContainerStyle,
  itemWidth,
  sectionHeaderTitle,
  headerShouldShowSeeAll,
  showHeaderOnPress = true,
  ...props
}: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main-list');
  const { state, deps } = useContext(GlobalContext);
  const { missionSearchMap } = state.mission;
  const navigation = useNavigation();

  const getMissionItemUuid = useCallback((mission: MissionModel.IMission, prefix: string) => `${prefix};${mission.uuid}`, []);
  const keyExtractor = useCallback((item: MissionModel.IMission) => item.uuid, []);

  const shouldShowStreakIndicator = useCallback(
    (mission: MissionModel.IMission) => mission.pointsAwarded.conditions.some(c => c.programType === OfferModel.ProgramType.STREAK),
    []
  );

  const renderItem = useCallback(
    ({ item: mission }: { item: MissionModel.IMission }) => (
      <View
        style={itemContainerStyle ?? {}}
        collapsable={false}
        ref={itemRef => setMissionItemRef(getMissionItemUuid(mission, missionItemUuidPrefix), itemRef)}
        {...getTestIdProps(`${missionItemUuidPrefix}-item`)}
      >
        <MissionImpressionView
          streakIndicator={shouldShowStreakIndicator(mission)}
          missionCardComponent={missionCardComponent}
          mission={mission}
          onPress={itemOnPress}
          wasViewed={viewedMissionList.includes(getMissionItemUuid(mission, missionItemUuidPrefix))}
          creativeType={ButtonCreativeType.CAROUSEL}
        />
      </View>
    ),
    [
      itemOnPress,
      viewedMissionList,
      setMissionItemRef,
      getMissionItemUuid,
      shouldShowStreakIndicator,
      getTestIdProps,
      itemContainerStyle,
      missionCardComponent,
      missionItemUuidPrefix
    ]
  );

  const headerTitle = useMemo(
    () => props?.title ?? sectionHeaderTitle ?? state.mission.missionListTitleMap[listType],
    [props?.title, sectionHeaderTitle, state.mission.missionListTitleMap, listType]
  );

  const shouldShowSeeAll = useMemo(
    () => (props?.seeAllButton ?? headerShouldShowSeeAll ?? missionSearchMap[listType]?.length > ENV.MISSION_LIMIT.KEEP_EARNING) && showHeaderOnPress,
    [props?.seeAllButton, headerShouldShowSeeAll, missionSearchMap, listType, showHeaderOnPress]
  );

  return data.length ? (
    <ErrorBoundary>
      <View style={styles.sectionMain} {...getTestIdProps(`${missionItemUuidPrefix}-section-container`)}>
        {missionSearchMap[listType]?.length ? (
          <SectionHeader
            title={headerTitle}
            shouldShowSeeAll={shouldShowSeeAll}
            seeAllProps={
              shouldShowSeeAll
                ? {
                    ...getTestIdProps(`${missionItemUuidPrefix}-see-all-btn`),
                    onPress: () =>
                      navigation.navigate(ROUTES.MISSION_SEE_ALL, {
                        searchKey: KnownMissionSearchKey.SEE_ALL,
                        missionListType: listType,
                        title: state.mission.missionListTitleMap[listType]
                      })
                  }
                : null
            }
          />
        ) : null}
        <Carrousel separatorWidth={5} itemWidth={itemWidth}>
          <FlatList
            style={[styles.list, styles.featureList]}
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

export default memo(MissionList);
