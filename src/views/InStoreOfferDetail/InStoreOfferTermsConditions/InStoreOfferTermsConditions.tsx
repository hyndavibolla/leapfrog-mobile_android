import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { ToggleContent } from '_commons/components/molecules/ToggleContent';
import { FONT_SIZE, COLOR } from '_constants';

import HowItWorks from '_assets/in-store-offer/howItWorks.svg';
import HowItWorksActive from '_assets/in-store-offer/howItWorksActive.svg';

import styles from './styles';
import { useTestingHelper } from '_utils/useTestingHelper';

interface Props {
  isActive: boolean;
}

const InStoreOfferTermsConditions = ({ isActive }: Props) => {
  const { getTestIdProps } = useTestingHelper('in-store-offer-conditions');

  return (
    <View style={styles.container}>
      <ToggleContent title="How it works" titleColor={COLOR.BLACK} titleSize={FONT_SIZE.PETITE}>
        <View style={styles.howItWorkSection}>
          {isActive ? (
            <View {...getTestIdProps('how-it-works-active')}>
              <HowItWorksActive />
            </View>
          ) : (
            <HowItWorks />
          )}
          <Text style={styles.topDescription}>
            Click "Activate" and make a purchase with a linked card in cardlink program. Within 24 to 48 hours you will have the Shop Your Way points to use as
            you wish
          </Text>
        </View>
      </ToggleContent>
      <View style={styles.termsSection}>
        <ToggleContent title="Terms & Conditions" titleColor={COLOR.BLACK} titleSize={FONT_SIZE.PETITE}>
          <Text style={styles.bottomDescription}>
            These Membership Terms and Conditions (“Membership Terms”) apply to all members of the Shop Your Way Program (previously called the Shop Your Way
            Rewards Program offered by Sears Holdings Management Corporation)
          </Text>
        </ToggleContent>
      </View>
    </View>
  );
};

export default memo(InStoreOfferTermsConditions);
