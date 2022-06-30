import React, { memo, useContext } from 'react';
import { View, Image, ScrollView } from 'react-native';

import { Text } from '../../shared/Text';
import { GlobalContext } from '../../../state-mgmt/GlobalState';
import { Button } from '../../shared/Button';
import { styles } from './styles';
import { FONT_FAMILY } from '../../../constants';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export interface Props {
  btnText: string;
  onPress: () => void;
}

export const GetSYWCard = ({ btnText, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('get-syw-card');
  const { deps } = useContext(GlobalContext);
  const linkUrl = 'https://shopyourway.com/card';

  return (
    <ScrollView {...getTestIdProps('container')} style={styles.container}>
      <Image source={require('../../../assets/credit-card/creditCard.png')} resizeMode="contain" />

      <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.textCenter]}>
        The Shop Your Way Mastercard® rewards members with more ways to earn points on eligible everyday purchases.
      </Text>

      <View style={styles.listContainer}>
        {[
          {
            icon: require('../../../assets/points-view/gas.png'),
            percentage: 5,
            description: 'On eligible purchases at ',
            descriptionHighlight: 'gas stations**'
          },
          {
            icon: require('../../../assets/points-view/grocery.png'),
            percentage: 3,
            description: 'On eligible purchases at ',
            descriptionHighlight: 'grocery stores restaurants**'
          },
          {
            icon: require('../../../assets/points-view/merchants.png'),
            percentage: 2,
            description: 'On eligible purchases at ',
            descriptionHighlight: 'Shop Your Way Merchants*'
          },
          {
            icon: require('../../../assets/points-view/elegible.png'),
            percentage: 1,
            description: 'On all other ',
            descriptionHighlight: 'eligible purchases'
          }
        ].map(({ icon, percentage, description, descriptionHighlight }, index) => (
          <View style={styles.listItemContainer} key={index}>
            <Image source={icon} style={styles.icon as any} />

            <View>
              <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.pointsText]}>
                <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.percentageText]}>
                  {percentage}%{' '}
                </Text>
                in points*
              </Text>

              <Text font={FONT_FAMILY.SEMIBOLD} style={[styles.text, styles.description]}>
                {description}
                <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.description]}>
                  {descriptionHighlight}
                </Text>
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.linkContainer}>
        <Text style={styles.link} onPress={() => deps.nativeHelperService.linking.openURL(linkUrl)} {...getTestIdProps('card-link')}>
          *Shop Your Way additional category earn program
        </Text>

        <Text style={styles.extraNote}>
          ** On the first $10,000 of combined gas, grocery and restaurant purchases per calendar year and then 1% thereafter.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={onPress} innerContainerStyle={styles.buttonInner} textStyle={styles.buttonText} {...getTestIdProps('apply-btn')}>
          {btnText}
        </Button>
      </View>
    </ScrollView>
  );
};

export default memo(GetSYWCard);
