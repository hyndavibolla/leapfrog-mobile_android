import React, { memo, useContext, useRef, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { WalletMainSkeleton } from '_views/WalletMain/components/WalletMainSkeleton';
import { LinkedCardsScreen } from '_views/WalletMain/components/LinkedCardsScreen';
import ErrorBoundary from '_components/ErrorBoundary';
import { useGetLinkedCardsList } from '_state_mgmt/cardLink/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';

import { styles } from './styles';

const CreditCards = () => {
  const { getTestIdProps } = useTestingHelper('credit-cards');
  const mainScrollViewRef = useRef<ScrollView>();
  const { state } = useContext(GlobalContext);
  const {
    cardLink: { linkedCardsList }
  } = state;

  const [onLoadLinkedCardsList, isLoadingLinkedCardsList = true, linkedCardsListError] = useGetLinkedCardsList();

  useFocusEffect(
    useCallback(() => {
      onLoadLinkedCardsList();
      mainScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, [onLoadLinkedCardsList])
  );

  return (
    <View style={styles.container}>
      {isLoadingLinkedCardsList ? (
        <WalletMainSkeleton />
      ) : (
        <ScrollView ref={mainScrollViewRef} {...getTestIdProps('container')} showsVerticalScrollIndicator={false}>
          <ErrorBoundary>
            <LinkedCardsScreen linkedCardsList={linkedCardsList} linkedCardsListError={linkedCardsListError} />
          </ErrorBoundary>
        </ScrollView>
      )}
    </View>
  );
};
export default memo(CreditCards);
