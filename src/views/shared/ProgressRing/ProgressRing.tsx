import React, { memo } from 'react';
import Svg, { Circle, Text } from 'react-native-svg';
import { View, StyleProp, ViewStyle } from 'react-native';

import { styles } from './styles';
import { COLOR, FONT_FAMILY } from '../../../constants';

export interface Props {
  width?: number;
  strokeWidth?: number;
  color?: COLOR;
  textColor?: COLOR;
  progress: number;
  label?: string;
  sublabel?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressRing = ({
  width = 175,
  strokeWidth = 15,
  color = COLOR.PRIMARY_LIGHT_BLUE,
  textColor = COLOR.PRIMARY_BLUE,
  progress,
  label = '',
  sublabel = '',
  style
}: Props) => {
  const size = width - 32;
  const progressStrokeWidth = strokeWidth;
  const placeholderStrokeWidth = strokeWidth + 1;
  const radius = (size - progressStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = ((progress * circumference) / 100) * -1;
  const center = size / 2;
  const sublabelAxisYOffset = center + 15;
  const zeroPointRadius = strokeWidth / 2;

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} style={styles.progressRing}>
        <Circle stroke={color} fill="none" cx={center} cy={center} r={radius} strokeWidth={progressStrokeWidth} />
        <Circle
          stroke={COLOR.MEDIUM_GRAY}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeWidth={placeholderStrokeWidth}
          strokeDashoffset={strokeDashoffset}
        />
        <Text
          x={center}
          y={center}
          fontFamily={FONT_FAMILY.BOLD}
          textAnchor="middle"
          fill={textColor}
          stroke={textColor}
          fontSize="18px"
          transform={`rotate(90, ${center}, ${center})`}
          letterSpacing={3}
        >
          {label}
        </Text>
        <Text
          x={center}
          y={sublabelAxisYOffset}
          fontFamily={FONT_FAMILY.BOLD}
          fontWeight="bold"
          textAnchor="middle"
          fill={COLOR.DARK_GRAY}
          fontSize="12px"
          transform={`rotate(90, ${center}, ${center})`}
        >
          {sublabel}
        </Text>
        {progress === 0 ? <Circle fill={color} cx={center + radius} cy={center} r={zeroPointRadius} /> : null}
      </Svg>
    </View>
  );
};

export default memo(ProgressRing);
