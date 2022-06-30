import React, { memo, useCallback, useContext } from 'react';
import { View, Image, Text, ImageStyle, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { ROUTES } from '_constants/routes';
import { CONTAINER_STYLE } from '_constants/styles';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  title: string;
  subtitle: string;
}
export const cardDetailTitle = 'SHOP YOUR WAY MASTERCARD®';

const UserHasSywCard = ({ title, subtitle, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('user-has-syw-card');
  const { navigate } = useNavigation();
  const {
    state: {
      cardLink: { linkedCardsList },
      game: {
        current: {
          memberships: { sywCardLastFour }
        }
      }
    }
  } = useContext(GlobalContext);
  const linkedCard = linkedCardsList.find(card => card.isSywCard);

  const handlePressShowDetailButton = useCallback(() => {
    navigate(ROUTES.WALLET_DETAIL, {
      cardId: linkedCard?.cardId,
      isSywCard: true,
      isLinkedToCardlink: !!linkedCard?.isSywCard,
      cardLastFour: linkedCard?.cardLastFour ? linkedCard.cardLastFour : sywCardLastFour,
      title: cardDetailTitle
    });
  }, [navigate, linkedCard, sywCardLastFour]);

  return (
    <Pressable onPress={handlePressShowDetailButton} {...getTestIdProps('show-detail-btn')}>
      <View {...getTestIdProps('container')} {...props}>
        <Text style={styles.title}>{title}</Text>
        <View style={[CONTAINER_STYLE.shadow, styles.card]} {...getTestIdProps('apply-now-container')}>
          <Image source={require('_assets/credit-card/creditCard.png')} style={styles.image as ImageStyle} />
          <Text style={styles.cardTitle}>{subtitle} </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(UserHasSywCard);
