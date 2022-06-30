import React, { memo } from 'react';
import { View, ScrollView } from 'react-native';

import { Text } from '_components/Text';
import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_FAMILY, FONT_SIZE, ICON } from '_constants';

import { styles } from './styles';

export const HowItWorksPoints = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text font={FONT_FAMILY.HEAVY} style={styles.title}>
          How do points work?
        </Text>
        <View style={styles.section}>
          <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.SMALLER} />
          <Text style={styles.subtitle}>Available points:</Text>
          <Text style={styles.paragraph}>
            Available points are ready to be redeemed! Use points for Gift Cards in the Rewards section of MAX, or on our Marketplace partner products. Treat
            yourself! You’ve earned it!
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.lockContainer}>
            <Icon name={ICON.LOCK_CIRCLE} color={COLOR.DARK_GRAY} size={FONT_SIZE.SMALL} />
          </View>
          <Text style={styles.subtitle}>Pending points:</Text>
          <Text style={styles.paragraph}>
            After you make a qualifying purchase with a merchant, the points you’ve earned will be in a “pending” state until the purchase has been cleared with
            the merchant. Please allow up to ninety days to receive the points back for any mobile or online purchases.
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.arrowContainer}>
            <Icon name={ICON.ARROW_DOWN} color={COLOR.WHITE} size={FONT_SIZE.TINY} />
          </View>
          <Text style={styles.subtitle}>Expiring points:</Text>
          <Text style={styles.paragraph}>
            All points earned have an expiration date. We’ll be sure to let you know when they are getting close! After points are expired, those points will
            not be eligible for redemption and removed from your available point balance.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default memo(HowItWorksPoints);
