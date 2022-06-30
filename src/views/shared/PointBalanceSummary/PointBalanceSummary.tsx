import React, { memo } from 'react';
import { TouchableHighlight, View, ImageBackground } from 'react-native';
import { Text } from '../Text';

import { styles } from './styles';
import { Icon } from '_commons/components/atoms/Icon';
import ClaimIcon from '_assets/button/claimIcon.svg';
import { Card } from '../Card';
import { formatNumber } from '_utils/formatNumber';
import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR, colorWithOpacity, FONT_FAMILY, FONT_SIZE, ICON } from '_constants';
import LinearGradient from 'react-native-linear-gradient';

export interface Props {
  onPressTop?: () => void;
  onPressBottom?: () => void;
  availablePoints?: number;
  pendingPoints?: number;
}

export const PointBalanceSummary = ({ onPressTop, onPressBottom, availablePoints = 0, pendingPoints = 0 }: Props) => {
  const { getTestIdProps } = useTestingHelper('point-balance-summary');
  return (
    <Card style={styles.containerGeneral}>
      <LinearGradient
        start={{ x: 0, y: 0.75 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
        colors={[colorWithOpacity(COLOR.PRIMARY_BLUE, 80), COLOR.PRIMARY_BLUE]}
        {...getTestIdProps('gradient')}
      >
        <ImageBackground
          style={styles.backgroundContainer as any}
          imageStyle={{ flex: 1, resizeMode: 'repeat' }}
          source={require('_assets/shared/pointBalancePatternAsset.png')}
        >
          <TouchableHighlight {...getTestIdProps('top-btn')} onPress={onPressTop} underlayColor="transparent" activeOpacity={1}>
            <View style={styles.containerPoints}>
              <View style={styles.containerAvailable}>
                <Text font={FONT_FAMILY.BOLD} style={styles.textTitle}>
                  Available Points
                </Text>
                <View style={styles.pointsContainer}>
                  <ClaimIcon style={styles.buttonIcon} width={20} height={20} />
                  <Text font={FONT_FAMILY.HEAVY} style={styles.textPoints} {...getTestIdProps('available-points-label')}>
                    {formatNumber(availablePoints)}
                  </Text>
                </View>
              </View>
              <View style={styles.containerPending}>
                <View style={styles.containerPendingTitle}>
                  <Text font={FONT_FAMILY.BOLD} style={styles.textTitle}>
                    Pending
                  </Text>
                </View>
                <View style={styles.pointsContainer}>
                  <ClaimIcon style={styles.buttonIcon} width={20} height={20} />
                  <Text font={FONT_FAMILY.HEAVY} style={styles.textPoints} {...getTestIdProps('pending-points-label')}>
                    {formatNumber(pendingPoints)}
                  </Text>
                </View>
              </View>
              <Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.WHITE} />
            </View>
          </TouchableHighlight>
        </ImageBackground>
      </LinearGradient>
      <TouchableHighlight {...getTestIdProps('bottom-btn')} onPress={onPressBottom} underlayColor="transparent" activeOpacity={1}>
        <View style={styles.containerMember}>
          <View style={styles.containerBarcode}>
            <Icon name={ICON.BAR_CODE} size={FONT_SIZE.HUGE} color={COLOR.DARK_GRAY} />
            <Text font={FONT_FAMILY.BOLD} style={styles.textMember}>
              Your member number and pin
            </Text>
          </View>

          <Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.SMALL} color={COLOR.DARK_GRAY} />
        </View>
      </TouchableHighlight>
    </Card>
  );
};

export default memo(PointBalanceSummary);
