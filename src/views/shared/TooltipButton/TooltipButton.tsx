import React, { ComponentProps, memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import TooltipInactiveAlt from '_assets/tooltip/tooltipInactive.svg';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export type Props = ComponentProps<typeof TouchableOpacity> & { flashy: boolean; altInactive?: boolean };

export const TooltipButton = ({ flashy, altInactive, ...props }: Props) => {
  const { getTestIdProps } = useTestingHelper('tooltip-button');
  const Container: any = props.onPress ? TouchableOpacity : View;
  return (
    <Container {...props} {...getTestIdProps('container')} style={styles.container}>
      {flashy ? (
        <LottieView source={require('../../../assets/tooltip/tooltip-animation.json')} autoSize autoPlay loop {...getTestIdProps('button')} />
      ) : (
        <>
          {altInactive ? (
            <View style={styles.inactiveContainer}>
              <TooltipInactiveAlt />
            </View>
          ) : (
            <View style={styles.inactiveContainer}>
              <Icon name={ICON.CLOSE} color={COLOR.DARK_GRAY} size={FONT_SIZE.MEDIUM} />
            </View>
          )}
        </>
      )}
    </Container>
  );
};

export default memo(TooltipButton);
