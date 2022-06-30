import React, { memo, useCallback } from 'react';
import { Text, View, Pressable, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { EmptyState } from '../../../shared/EmptyState';

import { CONTAINER_STYLE, ICON, ROUTES, COLOR } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import CreditCardIcon from '_assets/in-store-offer/creditCard.svg';
import CardLinkFallbackIcon from '_assets/in-store-offer/cardLinkFallback.svg';
import { styles } from './styles';
import { ILinkedCard } from '_models/cardLink';
import { LinkedCardListItem } from '../LinkedCardListItem';
import { Icon } from '_commons/components/atoms/Icon';

export interface Props {
  linkedCardsListError: any;
  linkedCardsList: ILinkedCard[];
}

export const LinkedCardList = ({ linkedCardsListError, linkedCardsList }: Props) => {
  const { getTestIdProps } = useTestingHelper('linked-cards');
  const { navigate } = useNavigation();

  const handlePressAddCardButton = useCallback(() => {
    navigate(ROUTES.IN_STORE_OFFERS.CARD_LINK);
  }, [navigate]);

  if (linkedCardsListError) {
    return (
      <EmptyState visible Icon={CardLinkFallbackIcon} title="Whoops! We had a problem loading your linked cards." card {...getTestIdProps('empty-state')} />
    );
  }
  return (
    <>
      {linkedCardsList.map(({ cardId, cardType, cardLastFour, isSywCard }) => (
        <LinkedCardListItem key={cardId} cardId={cardId} cardType={cardType} cardLastFour={cardLastFour} isSywCard={isSywCard} isLinkedToCardlink />
      ))}
      {!linkedCardsList?.length && (
        <TouchableHighlight underlayColor="transparent" onPress={handlePressAddCardButton} {...getTestIdProps('container')}>
          <View style={[CONTAINER_STYLE.shadow, styles.banner]}>
            <CreditCardIcon width={40} height={40} />
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Eat and Earn</Text>
              <Text style={styles.bannerDescription}>
                Add any Visa, Mastercard, or{'\n'}American Express to earn points{'\n'}near you
              </Text>
              <View style={styles.bannerActionsContainer} {...getTestIdProps('add-card-btn')}>
                <Text style={styles.bannerTextAction}>Add my card</Text>
                <Icon name={ICON.ARROW_RIGHT} color={COLOR.BLACK} />
              </View>
            </View>
          </View>
        </TouchableHighlight>
      )}
      {linkedCardsList?.length ? (
        <Pressable style={styles.addAnotherCardContainer} onPress={handlePressAddCardButton} {...getTestIdProps('add-another-card-btn')}>
          <Text style={styles.addAnotherCardText}>+ Add Card</Text>
        </Pressable>
      ) : null}
    </>
  );
};
export default memo(LinkedCardList);
