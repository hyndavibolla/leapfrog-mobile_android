import React, { memo, useEffect, useContext, useMemo } from 'react';
import { View, Text, Image } from 'react-native';

import { useTestingHelper } from '../../../utils/useTestingHelper';
import { GlobalContext } from '../../../state-mgmt/GlobalState';

import { Button } from '../Button';
import { Loading } from '../../Loading';
import { InStoreOffers } from '../InStoreOffers';

import { BannerAddNewCard } from '../BannerAddNewCard';
import CardError from '../../../assets/shared/cardError.svg';

import { useGetLinkedCardsList } from '../../../state-mgmt/cardLink/hooks';

import { styles } from './styles';
import { ViewHideWithTutorial } from '_commons/components/organisms/ViewHideWithTutorial';

export interface Props {
  shouldShowOffers: boolean;
  onShowOffersPressed: () => void;
  onPressAddCardButton: () => void;
}

export const BannerAddCards = ({ shouldShowOffers, onShowOffersPressed, onPressAddCardButton }: Props) => {
  const { getTestIdProps } = useTestingHelper('banner-add-cards');
  const {
    state: {
      cardLink: { linkedCardsList }
    }
  } = useContext(GlobalContext);

  const [onLoadLinkedCardsList, isLoadingLinkedCardsList = true, linkedCardsListError] = useGetLinkedCardsList();

  useEffect(() => {
    onLoadLinkedCardsList();
  }, [onLoadLinkedCardsList]);

  const hasCardsLinkedToCardlink = useMemo(() => linkedCardsList.some(({ isSywCard }) => !isSywCard), [linkedCardsList]);

  if (isLoadingLinkedCardsList) {
    return <Loading style={styles.loading} text="Loading nearby restaurants" />;
  }

  if (linkedCardsListError) {
    return (
      <>
        <View style={styles.emptyContainer} {...getTestIdProps('empty-container')}>
          <CardError width="70" />
          <Text style={[styles.cardTitle, styles.cardFallbackTitle]}>Whoops! We couldn't load your linked cards</Text>
        </View>
      </>
    );
  }

  if (!linkedCardsList?.length) {
    return (
      <>
        <ViewHideWithTutorial style={styles.container} {...getTestIdProps('linked-cards-container')}>
          <BannerAddNewCard />
        </ViewHideWithTutorial>
      </>
    );
  }

  if (hasCardsLinkedToCardlink || shouldShowOffers) {
    return <InStoreOffers />;
  }

  return (
    <>
      <View style={styles.container} {...getTestIdProps('linked-cards-container')}>
        <View style={styles.bannerContainer}>
          <View style={styles.creditCardAndText}>
            <Image source={require('../../../assets/credit-card/creditCard.png')} style={styles.image as any} />
            <Text style={styles.cardTitle}>The Shop Your Way Mastercard® is already linked to Cardlink.</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              {...getTestIdProps('add-another-card')}
              innerContainerStyle={[styles.buttonInner, styles.buttonInnerText]}
              textStyle={[styles.buttonText, styles.secondaryButtonText]}
              onPress={onPressAddCardButton}
            >
              Add another card
            </Button>
            <Button
              {...getTestIdProps('button-show-offers')}
              innerContainerStyle={styles.buttonInner}
              textStyle={styles.buttonText}
              onPress={onShowOffersPressed}
            >
              See local offers
            </Button>
          </View>
        </View>
      </View>
    </>
  );
};

export default memo(BannerAddCards);
