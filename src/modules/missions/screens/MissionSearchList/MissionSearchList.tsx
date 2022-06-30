import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TouchableHighlight } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { SearchInput } from '_components/SearchInput';
import { Card } from '_components/Card';
import { BrandLogo } from '_components/BrandLogo';
import { Title, TitleType } from '_components/Title';
import { Icon } from '_commons/components/atoms/Icon';
import { StreakListSkeleton } from './components/MissionSearchListSkeleton';

import { useTestingHelper } from '_utils/useTestingHelper';
import { useEventTracker } from '_state_mgmt/core/hooks';
import { useMissionFreeSearch } from '_state_mgmt/mission/hooks';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { actions as missionActions } from '_state_mgmt/mission/actions';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { MissionListType } from '_models/mission';
import { MissionModel } from '_models';

import { normalizeTextForSearching } from '_utils/normalizeTextForSearching';
import { COLOR, ENV, ForterActionType, TealiumEventType, UxObject, ICON, ROUTES } from '_constants';
import NoResults from '_assets/shared/brandNoResults.svg';

import { styles } from './styles';

export interface Props {
  route: {
    params: {
      streakId: string;
    };
  };
  navigation: StackNavigationProp<any>;
}

function StreakList({ navigation, route }: Props) {
  const [text, setText] = useState('');
  const { trackUserEvent } = useEventTracker();

  const { getTestIdProps } = useTestingHelper('streak-list');
  const [onSearch, isSearching = true] = useMissionFreeSearch();

  const {
    state: {
      mission: { missionSearchMap, missionMap }
    },
    dispatch
  } = useContext(GlobalContext);

  useEffect(() => {
    dispatch(missionActions.flushSearchList(KnownMissionSearchKey.STREAK_BRANDS));
    onSearch(
      KnownMissionSearchKey.STREAK_BRANDS,
      MissionListType.DEFAULT,
      undefined,
      undefined,
      ENV.MISSION_LIMIT.FULL,
      undefined,
      undefined,
      route.params.streakId
    );
  }, [dispatch, onSearch, route.params.streakId]);

  const missionList = useMemo(
    () =>
      (missionSearchMap[KnownMissionSearchKey.STREAK_BRANDS] || /* istanbul ignore next */ [])
        .map(uuid => missionMap[uuid])
        .filter(brand => {
          const normalizedBrand = normalizeTextForSearching(brand?.brandName);
          return normalizedBrand && normalizedBrand.startsWith(normalizeTextForSearching(text));
        })
        .sort((a, b) => a.brandName.localeCompare(b.brandName)),
    [missionSearchMap, missionMap, text]
  );

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyStateContainer} {...getTestIdProps('empty-state')}>
        <View style={styles.emptyStateMessageContainer}>
          <NoResults />
          <Title style={styles.emptyStateTitle} type={TitleType.HEADER}>
            {'Woops! No search results :('}
          </Title>
        </View>
      </View>
    );
  }, [getTestIdProps]);

  const handleMissionPress = useCallback(
    (mission: MissionModel.IMission) => {
      trackUserEvent(
        TealiumEventType.SELECT_MISSION,
        {
          event_type: mission.brandName,
          event_detail: mission.offerId,
          uxObject: UxObject.LIST,
          brand_name: mission.brandName,
          brand_id: mission.brandRequestorId,
          brand_category: mission.brandCategories[0]
        },
        ForterActionType.TAP
      );
      navigation.navigate(ROUTES.MISSION_DETAIL, {
        brandRequestorId: mission.brandRequestorId,
        isAvailableStreakIndicator: true
      });
    },
    [navigation, trackUserEvent]
  );

  if (isSearching) return <StreakListSkeleton />;

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <SearchInput
        placeholder="Search brands"
        onChange={setText}
        value={text}
        hideFilters
        placeholderTextColor={COLOR.WHITE}
        Icon={<Icon name={ICON.SEARCH} color={COLOR.WHITE} />}
      />
      {!missionList.length ? (
        <ListEmptyComponent />
      ) : (
        <ScrollView style={styles.brandsContainer}>
          {missionList.map(brand => (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => handleMissionPress(brand)}
              {...getTestIdProps('brand-container-btn')}
              key={brand.uuid}
            >
              <Card style={styles.brandContainer}>
                <BrandLogo image={brand?.brandLogo} category={brand?.pointsAwarded?.conditions[0]?.category} style={styles.brandLogo} streakIndicator />
                <Text style={styles.brandName}>{brand.brandName}</Text>
              </Card>
            </TouchableHighlight>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
export default memo(StreakList);
