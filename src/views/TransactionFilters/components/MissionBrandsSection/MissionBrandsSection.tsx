import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { BrandLogo } from '_components/BrandLogo';
import { BubbleSkeleton } from '../BubbleSkeleton';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useMissionFreeSearch } from '_state_mgmt/mission/hooks';
import { TransactionFilter } from '_models/offer';
import { MissionListType } from '_models/mission';

import { useTestingHelper } from '_utils/useTestingHelper';
import { getNote } from '_utils/transactionFiltersUtil';
import { ENV, ROUTES } from '_constants';
import { numberOfBubbles, numberOfItemsToShow } from '_constants/transactionFilter';

import FallbackIcon from '_assets/fallbackTransactions/fallback.svg';

import { styles } from './styles';

export interface Props {
  transactionType: TransactionFilter;
}

const StreakSywMax = 'SYWMAX-Streak';
const missionListKey = `streak-main-mission-list-${StreakSywMax}`;

function MissionBrandsSection({ transactionType }: Props) {
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const { getTestIdProps } = useTestingHelper('mission-brands-section');
  const [onMissionSearch, isLoadingMissionList, errorMission] = useMissionFreeSearch(true);

  const {
    state: {
      mission: { missionSearchMap, missionMap }
    }
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!isFocused) return;
    onMissionSearch(missionListKey, MissionListType.DEFAULT, undefined, undefined, ENV.MISSION_LIMIT.STREAK, 0, undefined, undefined, StreakSywMax);
  }, [isFocused, onMissionSearch]);

  const brands = useMemo(() => {
    return (missionSearchMap[missionListKey] || [])
      .map(uuid => missionMap[uuid])
      .filter(Boolean)
      .slice(0, numberOfItemsToShow);
  }, [missionMap, missionSearchMap]);

  const renderBrand = useCallback(
    ({ item: { brandRequestorId, brandLogo } }) => {
      return (
        <Pressable
          {...getTestIdProps('brand')}
          onPress={() =>
            navigate(ROUTES.MISSION_DETAIL, {
              brandRequestorId,
              isAvailableStreakIndicator: true
            })
          }
        >
          <BrandLogo style={[styles.bubble, brands?.length <= numberOfBubbles && styles.SpecialBubble]} image={brandLogo} size={60} Fallback={FallbackIcon} />
        </Pressable>
      );
    },
    [brands?.length, getTestIdProps, navigate]
  );

  if (isLoadingMissionList) {
    return <BubbleSkeleton />;
  }

  if (errorMission || !brands?.length) {
    return null;
  }

  return (
    <>
      <Text style={styles.note} {...getTestIdProps('note')}>
        {getNote(transactionType)}
      </Text>
      <FlatList
        style={[styles.bubbles, brands.length <= numberOfBubbles && styles.specialBubbles]}
        contentContainerStyle={brands.length <= numberOfBubbles && styles.bubblesContainer}
        data={brands}
        renderItem={renderBrand}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}

export default memo(MissionBrandsSection);
