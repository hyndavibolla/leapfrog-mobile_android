import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import { FlatList, Pressable, Text } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { BubbleSkeleton } from '../BubbleSkeleton';
import { BrandLogo } from '_components/BrandLogo';
import { Carrousel } from '_components/Carrousel';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useRewardConfigBrandSearch } from '_state_mgmt/reward/hooks';
import { RewardModel } from '_models';
import { TransactionFilter } from '_models/offer';

import { useTestingHelper } from '_utils/useTestingHelper';
import { getNote } from '_utils/transactionFiltersUtil';
import { ENV, ROUTES } from '_constants';
import { numberOfBubbles, numberOfItemsToShow } from '_constants/transactionFilter';

import FallbackIcon from '_assets/fallbackTransactions/fallback.svg';

import { styles } from './styles';

export interface Props {
  transactionType: TransactionFilter;
}

function GiftCardSection({ transactionType }: Props) {
  const { navigate } = useNavigation();
  const isFocused = useIsFocused();
  const { getTestIdProps } = useTestingHelper('gift-card-section');

  const {
    state: {
      reward: {
        config: { categories },
        slideObjectMapByType
      }
    }
  } = useContext(GlobalContext);

  const [onRewardConfigBrandSearch, isLoadingReward = true, rewardError] = useRewardConfigBrandSearch();

  useEffect(() => {
    if (!isFocused) return;
    onRewardConfigBrandSearch();
  }, [isFocused, onRewardConfigBrandSearch]);

  const giftCards = useMemo(() => {
    const configCategoryMap = categories.reduce((total, { id, brands }) => ({ ...total, [id]: brands }), {});

    return configCategoryMap[ENV.CUSTOM_BRAND_CATEGORY_KEY]
      ?.map(({ brandId }) => slideObjectMapByType[RewardModel.SlideObjectType.BRAND][brandId])
      ?.filter(Boolean)
      ?.slice(0, numberOfItemsToShow);
  }, [categories, slideObjectMapByType]);

  const renderGiftCard = useCallback(
    ({ item: { id: brandId, iconUrl } }) => {
      return (
        <Pressable onPress={() => navigate(ROUTES.GIFT_CARD_DETAIL, { brandId })} {...getTestIdProps('gift-card')}>
          <BrandLogo style={[styles.bubble, giftCards?.length <= numberOfBubbles && styles.SpecialBubble]} image={iconUrl} size={60} Fallback={FallbackIcon} />
        </Pressable>
      );
    },
    [getTestIdProps, giftCards?.length, navigate]
  );

  if (isLoadingReward) {
    return <BubbleSkeleton />;
  }

  if (rewardError || !giftCards?.length) {
    return null;
  }

  return (
    <>
      <Text style={styles.note} {...getTestIdProps('note')}>
        {getNote(transactionType)}
      </Text>
      <Carrousel itemWidth={60} separatorWidth={16}>
        <FlatList
          style={[styles.bubbles, giftCards.length <= numberOfBubbles && styles.specialBubbles]}
          contentContainerStyle={[styles.container, giftCards.length <= numberOfBubbles && styles.bubblesContainer]}
          data={giftCards}
          renderItem={renderGiftCard}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </Carrousel>
    </>
  );
}

export default memo(GiftCardSection);
