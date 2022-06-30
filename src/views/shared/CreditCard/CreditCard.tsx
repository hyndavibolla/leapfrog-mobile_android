import React, { memo } from 'react';
import { TouchableHighlight, View, Image } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';
import { CONTAINER_STYLE } from '_constants';
import { BannerApplyAndUseNow } from '_components/BannersManageCards/BannerApplyAndUseNow';
import { Text } from '_components/Text';

import { styles } from './styles';

export interface Props {
  userHasSywCard: Boolean;
  onPress?: () => void;
}

export const CreditCard = ({ userHasSywCard, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('credit-card-card');

  return (
    <>
      <Text style={styles.title}>Shop Your Way Mastercard®{!userHasSywCard && '‡'}</Text>
      {userHasSywCard ? (
        <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')} style={[CONTAINER_STYLE.shadow, styles.container]}>
          <>
            <Image source={require('_assets/credit-card/creditCard.png')} style={styles.image as any} />
            <View style={styles.content}>
              <Text style={styles.title}>Use your Shop Your Way Mastercard® to earn additional points on eligible grocery store purchases!</Text>
              <Text style={styles.progressText}>*Only 1 stamp per purchase</Text>
            </View>
          </>
        </TouchableHighlight>
      ) : (
        <BannerApplyAndUseNow />
      )}
    </>
  );
};

export default memo(CreditCard);
