import React, { memo, useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';

import { Modal, ModalSize, ModalSubtitle, ModalTitle } from '_components/Modal';
import { Button } from '_components/Button';
import { FONT_SIZE, ICON } from '_constants';
import { Icon } from '_commons/components/atoms/Icon';

import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  visible: boolean;
  loadGiftCardBalanceData: () => Promise<void>;
  onPressOutside: () => void;
  checksAvailable: number;
}

export const CheckBalanceModal = ({ visible, loadGiftCardBalanceData, onPressOutside, checksAvailable }: Props) => {
  const { getTestIdProps } = useTestingHelper('check-balance-modal');

  const checkBalance = useCallback(async () => {
    onPressOutside();
    await loadGiftCardBalanceData();
  }, [onPressOutside, loadGiftCardBalanceData]);

  const modalTitle = useMemo(
    () => (
      <ModalTitle>
        <Text {...getTestIdProps('title')}>
          You will use {4 - checksAvailable} of the 3 allowed chances to check your balance.{'\n'} Are you sure?
        </Text>
      </ModalTitle>
    ),
    [checksAvailable, getTestIdProps]
  );
  const modalSubtitle = useMemo(() => {
    return checksAvailable <= 1 ? null : (
      <ModalSubtitle style={styles.modalDescription}>
        <Text {...getTestIdProps('subtitle')}>If so, you will have {checksAvailable === 2 ? 'one chance' : 'two chances'} remaining.</Text>
      </ModalSubtitle>
    );
  }, [checksAvailable, getTestIdProps]);

  return (
    <Modal size={ModalSize.DYNAMIC} visible={visible} onClose={onPressOutside} {...getTestIdProps('container')}>
      <View style={styles.trashIcon} {...getTestIdProps('icon-container')}>
        <Icon name={ICON.EXCLAMATION_CIRCLE} size={FONT_SIZE.XL} />
      </View>
      {modalTitle}
      {modalSubtitle}
      <View style={styles.selectionBtnContainer}>
        <Button innerContainerStyle={styles.button} onPress={checkBalance} {...getTestIdProps('yes-button')}>
          <Text style={styles.buttonText}>Yes</Text>
        </Button>
        <Button onPress={onPressOutside} {...getTestIdProps('not-now-button')} innerContainerStyle={styles.notNowButton}>
          <Text style={styles.textOutlineButton}>Not now</Text>
        </Button>
      </View>
    </Modal>
  );
};

export default memo(CheckBalanceModal);
