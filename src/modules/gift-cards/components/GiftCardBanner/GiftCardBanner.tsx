import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CardWithLogos from '_commons/components/molecules/CardWithLogos/CardWithLogos';
import { ROUTES } from '_constants/routes';
import { IGiftCard } from '_models/giftCard';
import { useTestingHelper } from '_utils/useTestingHelper';

export interface Props {
  giftCards: IGiftCard[];
}

const GiftCardBanner = ({ giftCards }: Props) => {
  const { getTestIdProps } = useTestingHelper('gift-card-banner');
  const { navigate } = useNavigation();

  const logos = useMemo(() => {
    return giftCards.map(giftCard => giftCard.brandDetails.brandLogo);
  }, [giftCards]);

  return (
    <View {...getTestIdProps('container')}>
      <CardWithLogos
        title="See my Gift Cards"
        logos={logos}
        onPress={() => {
          navigate(ROUTES.WALLET_YOUR_GIFT_CARDS.MAIN, { showYourGiftCards: true });
        }}
      />
    </View>
  );
};

export default memo(GiftCardBanner);
