import React, { memo, useState, PropsWithChildren, useCallback } from 'react';
import { View, TouchableHighlight, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { View as AnimatedView } from 'react-native-animatable';

import { Icon } from '_commons/components/atoms/Icon';
import { styles } from './styles';
import { Title, TitleType } from '../Title';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Text } from '../Text';
import { COLOR, FONT_SIZE, ICON } from '_constants';

export type Props = PropsWithChildren<{
  title: string;
  startsOpen?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  wrapperStyle?: StyleProp<ViewStyle> | StyleProp<TextStyle>;
  noUseDefaultPadding?: boolean;
}>;

export const Accordion = ({ title, startsOpen = true, noUseDefaultPadding = false, textStyle, titleStyle, wrapperStyle, children }: Props) => {
  const { getTestIdProps } = useTestingHelper('accordion');
  const [isOpen, setIsOpen] = useState(!!startsOpen);
  const Wrapper = ['string', 'number'].includes(typeof children) ? Text : View;
  const onToggle = useCallback(() => setIsOpen(prevState => !prevState), []);
  const duration = 300;
  const rotateDownAnimation = { 0: { rotate: '90deg' }, 1: { rotate: '-90deg' } };
  const rotateUpAnimation = { 0: { rotate: '-90deg' }, 1: { rotate: '90deg' } };
  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={onToggle} {...getTestIdProps('btn')} underlayColor="transparent" activeOpacity={1}>
        <View style={[styles.titleContainer, !noUseDefaultPadding && styles.paddingDefaultContainer]}>
          <Title type={TitleType.SECTION} style={titleStyle}>
            {title}
          </Title>
          <AnimatedView animation={(isOpen ? rotateDownAnimation : rotateUpAnimation) as any} duration={duration}>
            <Icon name={ICON.BRACKET_RIGHT} size={FONT_SIZE.REGULAR} color={COLOR.DARK_GRAY} />
          </AnimatedView>
        </View>
      </TouchableHighlight>
      <View style={[styles.textContainer, !noUseDefaultPadding && styles.paddingDefaultContainer, !isOpen && styles.hidden]}>
        <Wrapper style={[styles.text, textStyle, wrapperStyle]}>{children}</Wrapper>
      </View>
    </View>
  );
};

export default memo(Accordion);
