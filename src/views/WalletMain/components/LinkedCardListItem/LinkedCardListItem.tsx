import React, { memo } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { cardName } from '_models/cardLink';
import { useTestingHelper } from '_utils/useTestingHelper';

import { CONTAINER_STYLE, ROUTES } from '_constants';

import RightAngleBracketIcon from '_assets/in-store-offer/rightAngleBracket.svg';
import VisaCardIcon from '_assets/in-store-offer/visaCard.svg';
import MasterCardIcon from '_assets/in-store-offer/masterCard.svg';
import AmexCardIcon from '_assets/in-store-offer/amexCard.svg';
import DiscoverCardIcon from '_assets/in-store-offer/discoverCard.svg';

import { styles } from './styles';

const cardTypeIcon = {
  VISA: VisaCardIcon,
  MSTR: MasterCardIcon,
  DISC: DiscoverCardIcon,
  AMEX: AmexCardIcon
};

export interface Props {
  cardId?: string;
  cardLastFour?: string;
  cardType?: string;
  isSywCard?: boolean;
  isLinkedToCardlink?: boolean;
}

export const LinkedCardListItem = ({ cardId, cardLastFour, cardType, isSywCard, isLinkedToCardlink }: Props) => {
  const { getTestIdProps } = useTestingHelper('item');
  const { navigate } = useNavigation();

  return (
    <TouchableHighlight
      key={cardId}
      onPress={() =>
        navigate(ROUTES.WALLET_DETAIL, {
          cardId,
          isSywCard,
          isLinkedToCardlink,
          cardLastFour,
          title: isSywCard ? 'SHOP YOUR WAY MASTERCARD®' : cardName[cardType]
        })
      }
      style={CONTAINER_STYLE.shadow}
      underlayColor="transparent"
      {...getTestIdProps('container-card')}
    >
      <View style={[CONTAINER_STYLE.shadow, styles.card]}>
        {isSywCard ? <Image source={require('../../../../assets/credit-card/creditCard.png')} style={styles.image as any} /> : cardTypeIcon[cardType]()}
        <View style={styles.cardContent}>
          {isSywCard ? <Text style={styles.cardTitleMasterCard}>Shop Your Way Mastercard®</Text> : null}
          <Text style={[isSywCard ? styles.cardTitleMasterCard : styles.cardTitle]} {...getTestIdProps('last-four')}>{`**** ${cardLastFour}`}</Text>
        </View>
        <RightAngleBracketIcon width={20} height={20} />
      </View>
    </TouchableHighlight>
  );
};

export default memo(LinkedCardListItem);
