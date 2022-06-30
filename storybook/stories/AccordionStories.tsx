import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../styles';
import { Accordion } from '../../src/views/shared/Accordion';
import { LevelBenefit } from '../../src/views/shared/LevelBenefit';
import { useTimer } from '../../src/utils/useTimer';

const DynamicLines = () => {
  const { timer } = useTimer(2000);
  const lines = Math.round(Math.max(1, Math.min(30, timer / 1000)));
  return (
    <Text>{`${Array(lines)
      .fill('some text')
      .map((t, i) => `${i + 1}: ${t}`)
      .join('\n')}`}</Text>
  );
};

export const AccordionStory = () => {
  return (
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Accordion</Text>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With text</Text>
      <View style={styles.componentContainer}>
        <Accordion title="Details & Gift Card Terms">
          A Southwest® gift card is redeemable at southwest.com, 1-800-I FLY SWA, or Southwest Airlines ticket counter for air travel only. Gift card is not
          valid for Group Tickets, Vacations, or Cruise packages.
        </Accordion>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>Starts collapsed</Text>
      <View style={styles.componentContainer}>
        <Accordion title="Starts collapsed" startsOpen={false}>
          A Southwest® gift card is redeemable at southwest.com, 1-800-I FLY SWA, or Southwest Airlines ticket counter for air travel only. Gift card is not
          valid for Group Tickets, Vacations, or Cruise packages.
        </Accordion>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With text</Text>
      <View style={styles.componentContainer}>
        <Accordion title="Details & Gift Card Terms">
          A Southwest® gift card is redeemable at southwest.com, 1-800-I FLY SWA, or Southwest Airlines ticket counter for air travel only. Gift card is not
          valid for Group Tickets, Vacations, or Cruise packages.
        </Accordion>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With a long title</Text>
      <View style={styles.componentContainer}>
        <Accordion title="Details & Gift Card Terms & Details & Gift Card Terms & Details & Gift Card Terms & Details & Gift Card Terms & Details & Gift Card Terms">
          A Southwest® gift card is redeemable at southwest.com, 1-800-I FLY SWA, or Southwest Airlines ticket counter for air travel only. Gift card is not
          valid for Group Tickets, Vacations, or Cruise packages. Only four total forms of payment, including Southwest® gift card, may be combined per
          purchase. Gift card is nonrefundable and not redeemable for cash or credit except where required by law. Gift card is not replaceable if lost, stolen
          or destroyed. Protect the card like cash. For balance check, call 1-866-393-2081. Activation or use of Southwest® gift card constitutes acceptance of
          all terms and conditions on [southwest.com](southwest.com).
        </Accordion>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With dynamic height</Text>
      <View style={styles.componentContainer}>
        <Accordion title="Dynamic lines">
          <DynamicLines />
        </Accordion>
      </View>
      <View style={styles.division} />
      <Text style={styles.subtitle}>With complex content</Text>
      <View style={styles.componentContainer}>
        <Accordion title="Benefits">
          <LevelBenefit>
            <Text>Points Cashback!!!</Text>
          </LevelBenefit>
          <LevelBenefit>
            <Text>Points Cashback!!!</Text>
          </LevelBenefit>
        </Accordion>
      </View>
    </View>
  );
};
