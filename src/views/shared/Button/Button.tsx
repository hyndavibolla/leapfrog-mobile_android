import React, { memo, ReactElement, ReactNode, useMemo, ComponentProps } from 'react';
import { StyleProp, TextStyle, View, ViewStyle, TouchableOpacity } from 'react-native';
/** this is needed from "react-native-gesture-handler" for compatibility with other buggy libraries */
import { TouchableOpacity as TouchableOpacityAlt } from 'react-native-gesture-handler';

import { styles } from './styles';
import { Text } from '../Text';

type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>;

export interface Props extends TouchableOpacityProps {
  children: (string | number | ((index: number) => ReactElement))[] | (string | number | ReactElement | ReactNode);
  style?: StyleProp<ViewStyle>;
  containerColor?: string;
  innerContainerStyle?: StyleProp<ViewStyle>;
  innerContainerDisabledStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
  compatibilityMode?: boolean;
}

export const Button = ({
  children,
  style,
  containerColor,
  textColor,
  textStyle,
  innerContainerStyle,
  innerContainerDisabledStyle,
  disabled,
  compatibilityMode,
  ...props
}: Props) => {
  const containerStyleList = useMemo(() => [styles.container, style], [style]);
  const innerContainerStyleList = useMemo(
    () =>
      [
        styles.innerContainer,
        innerContainerStyle,
        containerColor && { backgroundColor: containerColor },
        disabled && styles.disabled,
        disabled && innerContainerDisabledStyle
      ].filter(Boolean),
    [innerContainerStyle, containerColor, disabled, innerContainerDisabledStyle]
  );
  const textStyleList = useMemo(() => [styles.text, textStyle, textColor && { color: textColor }], [textStyle, textColor]);

  const Touchable = (compatibilityMode ? TouchableOpacityAlt : TouchableOpacity) as typeof TouchableOpacity;

  return (
    <Touchable {...props} style={containerStyleList} disabled={disabled}>
      <View style={innerContainerStyleList}>
        {((children instanceof Array ? children : [children]) as ReactNode[]).map((child, index) => (
          <View key={index} style={!!index && styles.childContainerPadding}>
            {(() => {
              const type = typeof child;
              if (type === 'function') return (child as (i: number) => ReactNode)(index);
              if (['string', 'number'].includes(type)) return <Text style={textStyleList}>{child}</Text>;
              return child;
            })()}
          </View>
        ))}
      </View>
    </Touchable>
  );
};

export default memo(Button);
