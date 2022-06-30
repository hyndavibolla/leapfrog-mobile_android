import React, { memo } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

import { Modal, ModalSize } from '_components/Modal';
import { Text } from '_components/Text';
import { Button } from '_components/Button';
import { Icon } from '_commons/components/atoms/Icon';
import { FONT_FAMILY, ICON, FONT_SIZE, COLOR, LINE_HEIGHT } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';

import SpinnerWhiteAnimation from '_assets/spinner/spinner-loader-white.json';

import { styles } from './styles';
import { statusType } from '_models/giftCard';

export interface Props {
  name: string;
  isVisible: boolean;
  isLoading: boolean;
  status: statusType;
  onDismiss: () => void;
  onSuccess: () => void;
}

export const StatusConfirmationModal = ({ name, isVisible, isLoading, status, onDismiss, onSuccess }: Props) => {
  const { getTestIdProps } = useTestingHelper('archive-confirmation-modal');
  const actionTitle = status === statusType.ACTIVE ? 'archive' : 'unarchive';

  return (
    <Modal visible={isVisible} size={ModalSize.DYNAMIC} onPressOutside={() => onDismiss()} style={styles.modal}>
      <View style={styles.content} {...getTestIdProps('content')}>
        <View style={[styles.iconContainer, { backgroundColor: status === statusType.ACTIVE ? COLOR.DARK_GRAY : COLOR.PRIMARY_BLUE }]}>
          <Icon size={FONT_SIZE.HUGE} name={status !== statusType.ACTIVE ? ICON.FOLDER_ARROW_UP : ICON.FOLDER_ARROW_DOWN} color={COLOR.WHITE} />
        </View>
        <Text font={FONT_FAMILY.HEAVY} lineHeight={LINE_HEIGHT.BIG} style={styles.title}>
          You are about to {actionTitle} {name} Gift Card. Are you sure?
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            innerContainerStyle={styles.button}
            textStyle={styles.buttonText}
            disabled={isLoading}
            onPress={() => onSuccess()}
            {...getTestIdProps('confirm-button')}
          >
            {isLoading ? (
              <View style={styles.indicatorContainer} {...getTestIdProps('indicator')}>
                <LottieView style={styles.indicator} resizeMode={'contain'} loop autoPlay source={SpinnerWhiteAnimation} />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              `Yes, ${actionTitle}`
            )}
          </Button>
        </View>
        <View style={[styles.buttonContainer, styles.buttonContainerTransparent]}>
          <Button
            innerContainerStyle={[styles.button, styles.buttonTransparent]}
            textStyle={[styles.buttonText]}
            onPress={onDismiss}
            textColor={COLOR.PRIMARY_BLUE}
            {...getTestIdProps('cancel-button')}
          >
            No, thanks
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default memo(StatusConfirmationModal);
