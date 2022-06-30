import React, { memo, useState, useContext, useCallback, useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Modal, ModalSize } from '_components/Modal';
import { Title, TitleType } from '_components/Title';
import { Text } from '_components/Text';
import { Button } from '_components/Button';

import { ENV, FONT_FAMILY, ForterActionType, ROUTES, TealiumEventType } from '_constants';

import { useEventTracker } from '_state_mgmt/core/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useTestingHelper } from '_utils/useTestingHelper';

import CreditCardBenefits from '_assets/credit-card/benefits@3x.svg';

import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
}

export const ApplyNow = ({ navigation }: Props) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const { deps } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('apply-now');
  const ecmWidth = useMemo(() => deps.nativeHelperService.dimensions.getWindowWidth() - 60, [deps.nativeHelperService.dimensions]);
  const ecmHeight = useMemo(() => ecmWidth / 1.4, [ecmWidth]);
  const { trackUserEvent } = useEventTracker();
  const isIOS = useMemo(() => deps.nativeHelperService.platform.OS === 'ios', [deps.nativeHelperService.platform]);
  const benefitsImageScale = useMemo(() => (isIOS ? 1.6 : 1.2), [isIOS]);

  const onApplyingForCardPress = useCallback(() => {
    trackUserEvent(TealiumEventType.CARD_APPLICATION, { event_type: TealiumEventType.INITIATE_CITI_APPLICATION }, ForterActionType.TAP);
    navigation.navigate(ROUTES.FUSION_VIEWER, { routeToReturn: ROUTES.MAIN_TAB.WALLET });
  }, [navigation, trackUserEvent]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} {...getTestIdProps('non-ecm-content')}>
      <View style={styles.imageContainer}>
        <Image source={require('_assets/credit-card/creditCard.png')} style={styles.image as any} />
      </View>
      <View style={styles.sectionContainer}>
        <Title type={TitleType.HEADER} style={[styles.title, styles.nonEcmTitle]}>
          Get rewarded on everyday purchases.
        </Title>
        <Text style={[styles.text, styles.nonEcmParagraph]}>
          Start earning Shop Your Way® Points {'\n'} on eligible everyday purchases {'\n'} with a Shop Your Way Mastercard®
        </Text>
        <Text
          style={[styles.text, styles.nonEcmParagraph, styles.link, styles.linkNonECM]}
          onPress={() => setIsDetailsModalOpen(true)}
          {...getTestIdProps('see-details-link')}
        >
          See details
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={onApplyingForCardPress}
            innerContainerStyle={[styles.buttonOuter, styles.buttonInner]}
            textStyle={styles.buttonText}
            {...getTestIdProps('apply-btn')}
          >
            Apply Now
          </Button>
        </View>
      </View>
      <Modal
        visible={isDetailsModalOpen}
        size={ModalSize.FULL_SCREEN}
        onClose={() => setIsDetailsModalOpen(false)}
        onPressOutside={() => setIsDetailsModalOpen(false)}
        showCloseButton
        style={styles.modal}
        closeButtonStyle={styles.closeButton}
      >
        <View style={styles.modalContainer} {...getTestIdProps('details-modal-content')}>
          <Text font={FONT_FAMILY.BOLD} style={styles.modalTitle}>
            SHOP YOUR WAY MASTERCARD®
          </Text>
          <View style={styles.modalImageContainer}>
            <Image source={require('_assets/credit-card/creditCard.png')} style={styles.modalImage as any} />
          </View>
          <View style={styles.modalSectionContainer}>
            <Text font={FONT_FAMILY.BOLD} style={styles.modalText}>
              The Shop Your Way Mastercard® rewards members with more ways to earn points on eligible everyday purchases.
            </Text>
          </View>
          <View style={styles.largeContainer}>
            <View style={styles.modalBenefitsContainer}>
              <CreditCardBenefits style={styles.modalBenefits} width={ecmWidth * benefitsImageScale} height={ecmHeight * benefitsImageScale} />
            </View>
            <View style={styles.cardLinkContainer}>
              <Text style={styles.cardLink} onPress={() => deps.nativeHelperService.linking.openURL(ENV.FUSION.APPLY_NOW_URI)} {...getTestIdProps('card-link')}>
                *Shop Your Way additional category earn program
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default memo(ApplyNow);
