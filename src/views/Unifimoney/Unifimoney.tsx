import React, { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { Button } from '_components/Button';
import { Modal } from '_components/Modal';
import { Text } from '_components/Text';

import { useTestingHelper } from '_utils/useTestingHelper';

import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';

import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '_constants/routes';

function Unifimoney() {
  const [isModalOpen, setIsModelOpen] = useState(false);

  const { navigate } = useNavigation();
  const { getTestIdProps } = useTestingHelper('unifimoney');

  const openModal = () => {
    setIsModelOpen(true);
  };

  const closeModal = () => {
    setIsModelOpen(false);
  };

  const handleUnlink = () => {
    closeModal();
    navigate(ROUTES.PROFILE);
  };

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.circleContainer}>
        <View style={[styles.circle, styles.leftCircle]}>
          <Icon name={ICON.MAX} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.XXL} backgroundStyle={styles.maxIcon} />
        </View>
        <View style={styles.circle}>
          <Icon name={ICON.UNIFIMONEY} color={COLOR.MEDIUM_GREEN} size={FONT_SIZE.BIGGER} />
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>Congrats! Your Unifimoney account is already linked to MAX.</Text>
        <Text style={styles.description}>
          Linking your Unifimoney account to MAX helps you invest easily. Simply shop in MAX, earn points and invest them with Unifimoney.{' '}
        </Text>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.itemTitle}>Available items:</Text>
        <View style={styles.items}>
          <View>
            <View style={styles.item}>
              <Icon name={ICON.CRYPTO} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.MEDIUM} />
            </View>
            <Text style={styles.itemDescription}>Crypto</Text>
          </View>
          <View>
            <View style={[styles.item, styles.lastItem]}>
              <Icon name={ICON.METALS} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.REGULAR} />
            </View>
            <Text style={styles.itemDescription}>Metals</Text>
          </View>
        </View>
      </View>

      <Button innerContainerStyle={styles.innerContainerButton} style={styles.button} textStyle={styles.textButton} activeOpacity={0.8}>
        Go to Unifimoney
      </Button>
      <Text style={styles.link} onPress={openModal} suppressHighlighting {...getTestIdProps('unlink')}>
        Unlink my Unifimoney account
      </Text>

      <Modal visible={isModalOpen} onClose={closeModal} style={styles.modal} {...getTestIdProps('modal')}>
        <View {...getTestIdProps('modal-container')}>
          <Icon name={ICON.EXCLAMATION_CIRCLE} color={COLOR.ORANGE} size={FONT_SIZE.XL} />
          <Text style={styles.modalTitle}>You’re about to unlink your Unifimoney account.</Text>
          <Text style={styles.modalDescription}>
            If you unlink your account, you won’t be able to redeem the points you’ve earned in Unifimoney. Additionally, your investments won’t be shown in
            your Wallet anymore.
          </Text>
          <Text style={styles.modalQuestion}>Are you sure?</Text>
          <Button
            innerContainerStyle={styles.innerContainerButton}
            style={styles.button}
            textStyle={styles.textButton}
            activeOpacity={0.8}
            onPress={handleUnlink}
            {...getTestIdProps('modal-button')}
          >
            Yes, unlink my Unifimoney account
          </Button>
          <Text style={styles.cancelModal} onPress={closeModal} suppressHighlighting {...getTestIdProps('modal-cancel')}>
            Cancel
          </Text>
        </View>
      </Modal>
    </View>
  );
}

export default Unifimoney;
