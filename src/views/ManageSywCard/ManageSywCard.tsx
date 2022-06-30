import React, { memo, useContext, useMemo } from 'react';
import { View, Image, ScrollView } from 'react-native';

import { GlobalContext } from '../../state-mgmt/GlobalState';
import { Title, TitleType } from '../shared/Title/Title';
import { Button } from '../shared/Button';
import { useTestingHelper } from '../../utils/useTestingHelper';
import { ENV, FONT_FAMILY } from '../../constants';
import { Text } from '../shared/Text';

import { styles } from './styles';

export const ManageSywCard = () => {
  const { deps } = useContext(GlobalContext);
  const { getTestIdProps } = useTestingHelper('manage-syw-card');
  const ecmWidth = useMemo(() => deps.nativeHelperService.dimensions.getWindowWidth() - 60, [deps.nativeHelperService.dimensions]);
  const ecmHeight = useMemo(() => ecmWidth / 1.4, [ecmWidth]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} {...getTestIdProps('scroll-view')}>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/credit-card/creditCard.png')} style={styles.image as any} />
      </View>
      <View style={[styles.sectionContainer, { paddingBottom: ecmHeight / 10 }]}>
        <Title type={TitleType.HEADER} style={styles.title}>
          Manage your card {'\n'} from Citibank
        </Title>
        <Text style={[styles.text, styles.textSpacing]}>View your transactions, pay your bills, check your expenses and more.</Text>
        <View style={styles.buttonContainer}>
          <Button
            innerContainerStyle={[styles.buttonOuter, styles.buttonInner]}
            textStyle={styles.buttonText}
            onPress={() => deps.nativeHelperService.linking.openURL(ENV.CITI.LANDING_URL)}
            {...getTestIdProps('manage-card-button')}
          >
            Manage Card
          </Button>
        </View>
        <Text font={FONT_FAMILY.BOLD} style={[styles.text, styles.contactText]}>
          or contact:
        </Text>
        <Text
          font={FONT_FAMILY.BOLD}
          style={[styles.text, styles.link]}
          onPress={() => deps.nativeHelperService.linking.openURL(`tel:${ENV.CITI.PHONE_NUMBER}`)}
          {...getTestIdProps('phone-link')}
        >
          {ENV.CITI.PHONE_NUMBER}
        </Text>
        <Text style={[styles.text, styles.contactText]}>Available 24/7</Text>
      </View>
    </ScrollView>
  );
};

export default memo(ManageSywCard);
