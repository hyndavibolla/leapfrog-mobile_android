import React, { memo, useContext } from 'react';
import { View } from 'react-native';
import Barcode from 'react-native-barcode-builder';

import { Text } from '../Text';
import { Modal, ModalSize, ModalTitle, ModalSubtitle } from '../Modal';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getFormattedSYWMemberNumber } from '_utils/getFormattedSYWMemberNumber';
import { styles } from './styles';
import { COLOR } from '_constants';
import ErrorBoundary from '../ErrorBoundary';

export interface Props {
  visible?: boolean;
  onClose?: () => void;
}

export const YourPinNumberModal = ({ visible, onClose }: Props) => {
  const { state, deps } = useContext(GlobalContext);

  const { getTestIdProps } = useTestingHelper('point-balance');

  const formattedSYWMemberNumber = getFormattedSYWMemberNumber(state.user.currentUser.personal.sywMemberNumber);

  const width = deps.nativeHelperService.dimensions.getWindowWidth();
  const barcodeWidth = width / state.user.currentUser.personal.sywMemberNumber.length / 10;

  return (
    <>
      <Modal size={ModalSize.EXTRA_LARGE} visible={visible} onClose={onClose}>
        <View {...getTestIdProps('modal-container')}>
          <ModalTitle>Your member number and PIN</ModalTitle>
          <ModalSubtitle style={styles.subtitle}>Show this in your favorite Kmart or Sears store while paying to earn points.</ModalSubtitle>

          <ErrorBoundary>
            <View style={styles.barcodeModalBarcodeContainer} {...getTestIdProps('barcode-container')}>
              {!state.user.currentUser.personal.sywMemberNumber ? null : (
                <Barcode value={state.user.currentUser.personal.sywMemberNumber} format="CODE128" height={60} width={barcodeWidth} lineColor={COLOR.BLACK} />
              )}
            </View>
          </ErrorBoundary>

          <View style={styles.barcodeModalNumberContainer}>
            <Text style={styles.barcodeModalNumber}>{formattedSYWMemberNumber}</Text>
            <Text style={styles.barcodeModalNumber}>PIN: {state.user.currentUser.personal.sywPinNumber}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default memo(YourPinNumberModal);
