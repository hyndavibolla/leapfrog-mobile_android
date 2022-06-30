import React, { memo } from 'react';
import { TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgProps } from 'react-native-svg';

import { useTestingHelper } from '_utils/useTestingHelper';
import { COLOR, ICON, FONT_SIZE } from '_constants';
import { Icon as FontIcon } from '_commons/components/atoms/Icon';

import { Text } from '../Text';
import { styles } from './styles';

export interface Props {
  title: string;
  description: string;
  Icon: string | React.FC<SvgProps>;
  actionText?: string;
  onActionPress?: () => any;
  onClosePress: () => any;
}

export const NewOnMaxCard = ({ title, description, Icon, actionText, onActionPress, onClosePress }: Props) => {
  const { getTestIdProps } = useTestingHelper('new-on-max-card');
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width: width * 0.9 }]} {...getTestIdProps('container')}>
      {typeof Icon === 'string' ? (
        <FastImage source={{ uri: Icon }} style={styles.icon as any} resizeMode="contain" />
      ) : Icon ? (
        <Icon width={40} height={40} />
      ) : null}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        {actionText ? (
          <TouchableWithoutFeedback onPress={onActionPress} {...getTestIdProps('action-btn')}>
            <View style={styles.callToActionContainer}>
              <Text style={styles.callToActionText}>{actionText}</Text>
              <FontIcon name={ICON.ARROW_RIGHT} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      <TouchableWithoutFeedback onPress={onClosePress} {...getTestIdProps('close-btn')}>
        <View>
          <FontIcon name={ICON.CLOSE} color={COLOR.BLACK} size={FONT_SIZE.MEDIUM} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default memo(NewOnMaxCard);
