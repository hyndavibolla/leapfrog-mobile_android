import React, { memo, PropsWithChildren } from 'react';
import { StyleProp, TextStyle, TouchableHighlight, View } from 'react-native';

import WhiteExclamation from '../../../assets/shared/whiteExclamation.svg';
import CloseWhite from '../../../assets/button/closeWhite.svg';
import { Text } from '../Text';
import { styles } from './styles';
import { FONT_FAMILY } from '../../../constants';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR,
  ERROR_WITHOUT_ICON,
  INFO
}

export interface Props {
  title?: string;
  type?: ToastType;
  positionFromBottom?: number;
  showCloseBtn?: boolean;
  onPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
}

export const Toast = ({
  title,
  type,
  onPress,
  children,
  positionFromBottom = 25,
  showCloseBtn = true,
  titleStyle,
  descriptionStyle
}: PropsWithChildren<Props>) => {
  const { getTestIdProps } = useTestingHelper('toast');
  const toastStyle = (() => {
    switch (type) {
      case ToastType.ERROR:
      case ToastType.ERROR_WITHOUT_ICON:
        return styles.error;
      case ToastType.WARNING:
        return styles.warning;
      case ToastType.INFO:
        return styles.info;
      case ToastType.SUCCESS:
      default:
        return styles.success;
    }
  })();

  const textStyle = (() => {
    switch (type) {
      case ToastType.ERROR:
      case ToastType.ERROR_WITHOUT_ICON:
      case ToastType.WARNING:
      case ToastType.SUCCESS:
      default:
        return styles.textWhite;
    }
  })();

  return (
    <TouchableHighlight onPress={onPress} {...getTestIdProps('container')}>
      <View style={[styles.container, { bottom: positionFromBottom }]}>
        <View style={[styles.innerContainer, styles.toast, toastStyle]}>
          <View style={styles.textContainer}>
            {type !== ToastType.ERROR ? null : <WhiteExclamation style={styles.exclamationIcon} />}
            <View>
              {!title ? null : (
                <Text font={FONT_FAMILY.BOLD} style={[styles.title, textStyle, titleStyle]}>
                  {title}
                </Text>
              )}
              {!!children && typeof children === 'string' ? (
                <Text font={FONT_FAMILY.BOLD} style={[styles.description, textStyle, descriptionStyle]}>
                  {children}
                </Text>
              ) : (
                children
              )}
            </View>
          </View>
          {!showCloseBtn ? null : (
            <View style={styles.closeIcon}>
              <CloseWhite style={styles.closeIcon} />
            </View>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default memo(Toast);
