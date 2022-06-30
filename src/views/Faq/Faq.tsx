import React, { memo } from 'react';
import { View, ScrollView } from 'react-native';

import { Text } from '../shared/Text';
import { styles } from './styles';
import { FONT_FAMILY } from '../../constants';

export const Faq = () => {
  /** commented skeleton because there's no loading on this view
  if (isLoading) return <FaqSkeleton />; */
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text font={FONT_FAMILY.HEAVY} style={styles.title}>
          Frequently Asked {'\n'} Questions
        </Text>
        <Text font={FONT_FAMILY.HEAVY} style={styles.question}>
          1. I’ve made a transaction but I don’t see it on my balance?
        </Text>
        <Text style={styles.answer}>
          Sometimes this happens when we’re waiting for details from our offer partners. Make sure to review the offer details as some partners have longer
          point reporting periods.
          {'\n \n'}
          If it has been over 15 days, please contact us and provide evidence of the qualifying action or purchase, as well as requested points.
        </Text>

        <Text font={FONT_FAMILY.HEAVY} style={styles.question}>
          2. How can I earn points?
        </Text>
        <Text style={styles.answer}>
          There are several ways to earn new points. The Earn section is filled with offers you can complete to earn points. Please refer to the Shop Your Way®
          Program Terms and Conditions for additional information.
        </Text>

        <Text font={FONT_FAMILY.HEAVY} style={styles.question}>
          3. How returns affect my points?
        </Text>
        <Text style={styles.answer}>
          If a return or refund is issued for a qualifying purchase, points associated with that purchase will be deducted when the return is confirmed.
        </Text>
      </View>
    </ScrollView>
  );
};

export default memo(Faq);
