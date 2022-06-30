import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON, COLOR } from '_constants';
import { styles } from './styles';
import { useTestingHelper } from '_utils/useTestingHelper';

export interface Props {
  onPress?: () => void;
  testIdName?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const BackButton = ({ testIdName = 'default', onPress, containerStyle }: Props) => {
  const { goBack } = useNavigation();
  const { getTestIdProps } = useTestingHelper('back-button');

  return (
    <TouchableOpacity onPress={onPress ? onPress : goBack} style={[styles.backButton, containerStyle]} {...getTestIdProps(testIdName)}>
      <Icon name={ICON.ARROW_LEFT} color={COLOR.BLACK} />
    </TouchableOpacity>
  );
};
