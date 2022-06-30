import React, { memo, useContext, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable, Text } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { BrandLogo } from '_components/BrandLogo';
import { BubbleSkeleton } from '../BubbleSkeleton';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { useGetKnownMissionGroup } from '_state_mgmt/mission/hooks';
import { TransactionFilter } from '_models/offer';

import { useTestingHelper } from '_utils/useTestingHelper';
import { getNote } from '_utils/transactionFiltersUtil';
import { ROUTES } from '_constants';
import { numberOfBubbles, numberOfItemsToShow } from '_constants/transactionFilter';

import FallbackIcon from '_assets/fallbackTransactions/fallback.svg';

import { styles } from './styles';
import { isAvailableStreakIndicator } from '_utils/isAvailableStreakIndicator';
import { IMission } from '_models/mission';

export interface Props {
  transactionType: TransactionFilter;
}

function TopBrandsSection({ transactionType }: Props) {
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const { getTestIdProps } = useTestingHelper('top-brands-section');
  const [onLoadKnownMissionGroups, isLoadingMissions = true, errorMission] = useGetKnownMissionGroup();

  const {
    state: {
      mission: { missionSearchMap, missionMap }
    }
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!isFocused) return;
    onLoadKnownMissionGroups();
  }, [isFocused, onLoadKnownMissionGroups]);

  const brands = useMemo(() => {
    return missionSearchMap[KnownMissionSearchKey.DYNAMIC_LIST_3]
      .map(uuid => missionMap[uuid])
      .filter(Boolean)
      .slice(0, numberOfItemsToShow);
  }, [missionMap, missionSearchMap]);

  const renderTopBrand: ListRenderItem<IMission> = ({ item }) => {
    const { brandRequestorId, brandLogo } = item;
    return (
      <Pressable
        {...getTestIdProps('brand')}
        onPress={() =>
          navigate(ROUTES.MISSION_DETAIL, {
            brandRequestorId,
            isAvailableStreakIndicator: isAvailableStreakIndicator(item)
          })
        }
      >
        <BrandLogo style={[styles.bubble, brands?.length <= numberOfBubbles && styles.SpecialBubble]} image={brandLogo} size={60} Fallback={FallbackIcon} />
      </Pressable>
    );
  };

  if (isLoadingMissions) {
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
        renderItem={renderTopBrand}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
}

export default memo(TopBrandsSection);
