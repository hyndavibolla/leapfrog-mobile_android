import React, { memo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';
import { Text } from '_components/Text';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  label: string;
  value: boolean;
  squareShape?: boolean;
  selectedColor?: COLOR;
  onChange: (value: boolean) => void;
}

const CheckInput = ({ label, value, squareShape = false, selectedColor = COLOR.DARK_GREEN, onChange }: Props) => {
  const { getTestIdProps } = useTestingHelper('check-input');
  const onPress = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} {...getTestIdProps('container')}>
      {value ? (
        <View
          style={[squareShape ? styles.selectedSquareStateIcon : styles.selectedStateIcon, { backgroundColor: `${selectedColor}` }]}
          {...getTestIdProps('checked-icon')}
        >
          <Icon name={ICON.TICK} color={COLOR.WHITE} size={FONT_SIZE.SMALL} />
        </View>
      ) : (
        <View style={squareShape ? styles.emptySquareStateIcon : styles.emptyStateIcon} {...getTestIdProps('unchecked-icon')} />
      )}
      <View style={styles.textContainer}>
        <Text {...getTestIdProps('label')}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(CheckInput);
