import React, { memo } from 'react';
import { TouchableHighlight, Text, View, Image, ImageStyle } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { getFormattedCheckBalanceDate } from '_utils/getFormattedCheckBalanceDate';
import { getFixedValueWithDecimals } from '_utils/getFixedValueWithDecimals';
import { getIsSameDate } from '_utils/getIsSameDate';
import { noop } from '_utils/noop';
import { DateLike } from '_models/general';
import { CONTAINER_STYLE } from '_constants';
import { BrandLogo } from '_components/BrandLogo';

import { styles } from './styles';

export interface Props {
  name: string;
  value: string;
  onPress: () => void;
  cardBalance: number;
  cardBalanceCheckDt: DateLike;
  purchaseTs: DateLike;
  onLongPress?: () => void;
  brandLogo: string;
  faceplateUrl: string;
}

const GiftCard = ({ name, value, onPress, cardBalance, cardBalanceCheckDt, purchaseTs, brandLogo, faceplateUrl, onLongPress = noop }) => {
  const { getTestIdProps } = useTestingHelper('gift-card');
  const showCardBalanceDate = !getIsSameDate(cardBalanceCheckDt, purchaseTs);

  const cardBalanceDate = cardBalanceCheckDt ? (
    <Text style={styles.cardValueDate} {...getTestIdProps('balance-date')}>
      Balance Checked <Text style={styles.cardValueDateDays}>{getFormattedCheckBalanceDate(cardBalanceCheckDt)}</Text>
    </Text>
  ) : null;

  const cardBalanceValue = cardBalance ? (
    <View>
      <Text style={styles.cardValue} {...getTestIdProps('card-balance')}>
        ${getFixedValueWithDecimals(cardBalance, 2)}
      </Text>
    </View>
  ) : value ? (
    <View>
      <Text style={styles.cardValue} {...getTestIdProps('card-value')}>
        ${getFixedValueWithDecimals(Number(value), 2)}
      </Text>
    </View>
  ) : null;

  return (
    <TouchableHighlight style={CONTAINER_STYLE.shadow} underlayColor="transparent" onPress={onPress} onLongPress={onLongPress} {...getTestIdProps('container')}>
      <View style={[CONTAINER_STYLE.shadow, styles.card]}>
        {faceplateUrl ? (
          <Image source={{ uri: faceplateUrl }} resizeMode="cover" style={styles.faceplateImage as ImageStyle} />
        ) : (
          <View style={[CONTAINER_STYLE.shadow, styles.logoContainer]}>
            <BrandLogo image={brandLogo} style={styles.logo} size={40} isGiftCard />
          </View>
        )}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} ellipsizeMode="tail" numberOfLines={1}>
            {name}
          </Text>
          {cardBalanceValue}
          {showCardBalanceDate && cardBalanceDate}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default memo(GiftCard);
