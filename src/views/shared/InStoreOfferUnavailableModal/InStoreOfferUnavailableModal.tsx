import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { Title, TitleType } from '_components/Title';
import { Button } from '_components/Button';
import SYWIcon from '_assets/shared/sywIconDarkBlue.svg';
import { BrandLogo } from '_components/BrandLogo';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON, FONT_SIZE, COLOR } from '_constants';

import { styles } from './styles';

export interface Props {
  brandLogo?: string;
  brandName: string;
  onActionPress?: () => void;
}

export const InStoreOfferUnavailableModalKey = 'in-store-offer-activated-modal';

const InStoreOfferUnavailableModal = ({ brandLogo, brandName, onActionPress }: Props) => {
  const { getTestIdProps } = useTestingHelper(InStoreOfferUnavailableModalKey);
  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.header}>
        <BrandLogo image={brandLogo} Fallback={SYWIcon} size={60} />
        <Text style={styles.plus}>+</Text>
        <Icon name={ICON.OFFER_CIRCLE} color={COLOR.DARK_GRAY} size={FONT_SIZE.XL} />
      </View>
      <Title style={styles.title} type={TitleType.HEADER}>
        {brandName} offer isn't available now
      </Title>
      <View style={styles.body}>
        <Text style={styles.bodyText}>Please try again later. Or explore other participating locations nearby. 🛍️</Text>
      </View>

      <Button innerContainerStyle={styles.linkBtnInnerContainer} textStyle={styles.linkBtnText} onPress={onActionPress} {...getTestIdProps('action-btn')}>
        Got it!
      </Button>
    </View>
  );
};

export default memo(InStoreOfferUnavailableModal);
