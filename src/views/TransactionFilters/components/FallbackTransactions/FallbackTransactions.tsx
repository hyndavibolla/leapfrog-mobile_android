import React, { memo, useCallback, useMemo } from 'react';
import { ScrollView, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Button } from '_components/Button';
import ErrorBoundary from '_components/ErrorBoundary';

import { useLocationPermission } from '_utils/useLocationPermission';
import { useTestingHelper } from '_utils/useTestingHelper';

import { GiftCardSection } from '../GiftCardSection';
import { LocalOffersSection } from '../LocalOffersSection';
import { TopBrandsSection } from '../TopBrandsSection';
import { MissionBrandsSection } from '../MissionBrandsSection';

import { TransactionFilter } from '_models/offer';
import { getRoute, getSubtitle, getTextButton, getTitle } from '_utils/transactionFiltersUtil';
import { Section } from '_modules/earn/screens/EarnMain/EarnMain';

import { ROUTES } from '_constants';

import MastercardIcon from '_assets/fallbackTransactions/mastercard.svg';
import MissionsIcon from '_assets/fallbackTransactions/missions.svg';
import LocalOffersIcon from '_assets/fallbackTransactions/localOffers.svg';
import TransactionsIcon from '_assets/fallbackTransactions/transactions.svg';

import { styles } from './styles';

export function getIcon(transactionType: TransactionFilter) {
  switch (transactionType) {
    case TransactionFilter.ALL_TRANSACTIONS:
      return <TransactionsIcon width={100} height={100} style={styles.icon} />;
    case TransactionFilter.LOCAL_OFFERS:
      return <LocalOffersIcon width={100} height={100} style={styles.icon} />;
    case TransactionFilter.MISSIONS:
      return <MissionsIcon width={100} height={100} style={styles.icon} />;
    case TransactionFilter.REWARDS:
      return <TransactionsIcon width={100} height={100} style={styles.icon} />;
    case TransactionFilter.SYW_MASTERCARD:
      return <MastercardIcon width={100} height={100} style={styles.icon} />;
  }
}

export interface Props {
  transactionType: TransactionFilter;
  style?: StyleProp<ViewStyle>;
}

function FallbackTransactions({ transactionType, style }: Props) {
  const { navigate } = useNavigation();
  const { isLocationAvailable } = useLocationPermission();
  const { getTestIdProps } = useTestingHelper('fallback-transactions');

  const handleButtonPress = useCallback(() => {
    if (transactionType === TransactionFilter.LOCAL_OFFERS && isLocationAvailable) {
      navigate(ROUTES.IN_STORE_OFFERS.OFFER_SEARCH_MAP);
    } else {
      const route = getRoute(transactionType);
      if (transactionType === TransactionFilter.LOCAL_OFFERS) {
        const params: { scrollToSection: Section } = {
          scrollToSection: 'mapCardSection'
        };
        navigate(route, params);
      }
      navigate(route);
    }
  }, [isLocationAvailable, navigate, transactionType]);

  const getFooterSection = useMemo(() => {
    switch (transactionType) {
      case TransactionFilter.LOCAL_OFFERS:
        return <LocalOffersSection transactionType={transactionType} />;
      case TransactionFilter.REWARDS:
        return <GiftCardSection transactionType={transactionType} />;
      case TransactionFilter.MISSIONS:
        return <MissionBrandsSection transactionType={transactionType} />;
      default:
        return <TopBrandsSection transactionType={transactionType} />;
    }
  }, [transactionType]);

  return (
    <ScrollView contentContainerStyle={[styles.container, style]} showsVerticalScrollIndicator={false}>
      <View style={styles.containerData} {...getTestIdProps('container')}>
        {getIcon(transactionType)}
        <Text style={styles.title}>{getTitle(transactionType)}</Text>
        <Text style={styles.subtitle}>{getSubtitle(transactionType)}</Text>
        <Button {...getTestIdProps('button')} style={styles.button} innerContainerStyle={styles.innerButton} onPress={handleButtonPress}>
          {getTextButton(transactionType)}
        </Button>
      </View>
      <ErrorBoundary>{getFooterSection}</ErrorBoundary>
    </ScrollView>
  );
}

export default memo(FallbackTransactions);
