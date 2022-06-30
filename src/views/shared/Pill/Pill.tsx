import React, { memo, PropsWithChildren, ReactElement, useMemo, useCallback } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { Text } from '_components/Text';
import ErrorBoundary from '_components/ErrorBoundary';
import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR, FONT_SIZE, ICON } from '_constants';

import { styles } from './styles';

const propsForSize = {
  M: { container: [styles.container, styles.sizeContainerM], pointsText: [styles.pointsText, styles.sizePointTextM], iconSize: FONT_SIZE.REGULAR },
  S: { container: [styles.container, styles.sizeContainerS], pointsText: [styles.pointsText, styles.sizePointTextS], iconSize: FONT_SIZE.SMALL }
};

export interface Props {
  style?: StyleProp<ViewStyle>;
  icon?: ReactElement;
  isDisabled?: boolean;
  strikeThroughText?: string | number;
  textFallback?: string;
  iconSize?: FONT_SIZE;
  disableIcon?: boolean;
  iconContainerStyle?: StyleProp<ViewStyle>;
  size?: 'S' | 'M';
}
export const Pill = ({
  children,
  style,
  icon,
  strikeThroughText,
  textFallback = 'MAX Offer',
  isDisabled,
  size = 'M',
  iconSize = propsForSize[size].iconSize,
  disableIcon = false,
  iconContainerStyle
}: PropsWithChildren<Props>) => {
  const { getTestIdProps } = useTestingHelper('pill');
  const Wrapper = ['string', 'number'].includes(typeof children) ? Text : View;
  const pillTextStyle = useMemo(() => [...propsForSize[size].pointsText, isDisabled && styles.disabledText], [size, isDisabled]);
  const pillContainerStyle = useMemo(() => [isDisabled && styles.disabledContainer], [isDisabled]);

  const getColor = useCallback(() => {
    return isDisabled ? COLOR.DARK_GRAY : COLOR.PRIMARY_BLUE;
  }, [isDisabled]);

  return (
    <View {...getTestIdProps('container')} style={[propsForSize[size].container, pillContainerStyle, style]}>
      {!disableIcon && (
        <View {...getTestIdProps('icon')} style={[styles.icon, iconContainerStyle]}>
          {icon || <Icon name={ICON.SYW_CIRCLE} color={getColor()} size={iconSize} />}
        </View>
      )}
      <ErrorBoundary>
        <Wrapper style={[!disableIcon && styles.points, pillTextStyle]} {...getTestIdProps('text')}>
          {strikeThroughText ? (
            <>
              <Text {...getTestIdProps('strikethrough')} style={styles.strikeThroughText}>
                {`${strikeThroughText} `}
              </Text>
            </>
          ) : null}
          {children ? (
            children
          ) : (
            <Text style={pillTextStyle} {...getTestIdProps('text-fallback')}>
              {textFallback}
            </Text>
          )}
        </Wrapper>
      </ErrorBoundary>
    </View>
  );
};

export default memo(Pill);
