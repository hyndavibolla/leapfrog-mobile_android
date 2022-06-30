import React, { memo, useContext } from 'react';
import { Image, ImageStyle, View } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { Modal, ModalSize, ModalSubtitle, ModalTitle } from '_components/Modal';
import { Icon } from '_commons/components/atoms/Icon';
import { Button } from '_components/Button';
import { COLOR, FONT_SIZE, ICON } from '_constants';

import { styles } from './styles';

export interface Props {
  handleShouldShowApplication: () => void;
  isVisible: boolean;
}

const ApplicationModal = ({ isVisible, handleShouldShowApplication }: Props) => {
  const { getTestIdProps } = useTestingHelper('application-modal');
  const { deps } = useContext(GlobalContext);

  return (
    <Modal size={ModalSize.EXTRA_LARGE} visible={isVisible} onClose={handleShouldShowApplication}>
      <View style={[styles.modalContainer, { height: deps.nativeHelperService.dimensions.isSmallDevice ? 400 : 450 }]} {...getTestIdProps('container')}>
        <View style={styles.imageContainer}>
          <Image source={require('_assets/credit-card/creditCard.png')} style={styles.cardImage as ImageStyle} />
          <View style={styles.plusContainer}>
            <ModalTitle style={styles.plus}>+</ModalTitle>
          </View>
          <Icon name={ICON.OFFER_CIRCLE} color={COLOR.PURPLE} size={FONT_SIZE.XL} />
        </View>
        <ModalTitle>We're processing your Shop Your Way Mastercard® application now.</ModalTitle>

        <View style={styles.checkContainer}>
          <ModalSubtitle style={styles.modalSubtitleContainer}>Hold tight for just a few moments.</ModalSubtitle>
        </View>
        <ModalSubtitle style={styles.modalSubtitleContainer}>
          Once your application is complete, your card will be automatically enrolled in Cardlink — and you'll be able to eat and earn points at restaurants
          near you!
        </ModalSubtitle>
        <Button
          innerContainerStyle={styles.innerButton}
          textStyle={styles.buttonText}
          onPress={handleShouldShowApplication}
          {...getTestIdProps('close-button')}
        >
          Got it!
        </Button>
      </View>
    </Modal>
  );
};

export default memo(ApplicationModal);
