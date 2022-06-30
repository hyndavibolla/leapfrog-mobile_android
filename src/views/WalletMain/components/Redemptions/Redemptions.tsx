import React, { memo, useEffect, useContext, useRef, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useGiftCards } from '_state_mgmt/giftCard';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useGetCurrentGame } from '_state_mgmt/game/hooks';
import { useGetLinkedCardsList } from '_state_mgmt/cardLink/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';
import ErrorBoundary from '_components/ErrorBoundary';
import UserHasSywCard from '_views/WalletMain/components/UserHasSywCard/UserHasSywCard';
import { WalletMainSkeleton } from '_views/WalletMain/components/WalletMainSkeleton';
import { GiftCardsScreen } from '_views/WalletMain/components/GiftCardsScreen';
import { BannerApplyForCardWithDescription } from '_views/WalletMain/components/BannerApplyForCardWithDescription';

import { styles } from './styles';

const Redemptions = () => {
  const { getTestIdProps } = useTestingHelper('redemptions');
  const [getGameState, isLoadingGameState = true] = useGetCurrentGame();
  const [onLoadGiftCardsList, isLoadingGiftCardsList = true, giftCardsListError] = useGiftCards();
  const [onLoadLinkedCardsList, isLoadingLinkedCardsList = true] = useGetLinkedCardsList();
  const mainScrollViewRef = useRef(null);

  const {
    state: {
      giftCard: { giftCardsList },
      game: {
        current: {
          memberships: { userHasSywCard }
        }
      }
    }
  } = useContext(GlobalContext);

  useFocusEffect(
    useCallback(() => {
      mainScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, [])
  );

  useEffect(() => {
    getGameState();
    onLoadGiftCardsList();
    onLoadLinkedCardsList();
  }, [getGameState, onLoadGiftCardsList, onLoadLinkedCardsList]);

  return (
    <View style={styles.container}>
      {isLoadingGameState || isLoadingGiftCardsList || isLoadingLinkedCardsList ? (
        <WalletMainSkeleton />
      ) : (
        <ScrollView {...getTestIdProps('container')} ref={mainScrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={styles.sywCardContainer}>
            {userHasSywCard ? (
              <UserHasSywCard title={'Your moments, more rewarding.'} subtitle={'Your Shop Your Way Mastercard® is Active'} {...getTestIdProps('syw-card')} />
            ) : (
              <BannerApplyForCardWithDescription />
            )}
          </View>
          <ErrorBoundary>
            <GiftCardsScreen giftCardsList={giftCardsList} giftCardsListError={giftCardsListError} />
          </ErrorBoundary>
        </ScrollView>
      )}
    </View>
  );
};

export default memo(Redemptions);
