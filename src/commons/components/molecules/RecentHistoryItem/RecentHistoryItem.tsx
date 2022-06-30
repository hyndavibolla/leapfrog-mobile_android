import React, { memo } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import { Icon } from '../../atoms/Icon';

import { useTestingHelper } from '_utils/useTestingHelper';
import { ICON, FONT_SIZE, COLOR } from '_constants';
import { styles } from './styles';

export interface Props {
  title: string;
  category: boolean;
  onPress: () => void;
}

export const RecentHistoryItem = ({ title, category, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('recent-search');

  return (
    <TouchableOpacity {...getTestIdProps('item')} style={styles.itemSearchHistory} onPress={onPress}>
      <Icon name={!category ? ICON.SEARCH : ICON.FILTERS} size={FONT_SIZE.PETITE} color={COLOR.BLACK} />
      <Text style={styles.textSearchHistory}>{title}</Text>
    </TouchableOpacity>
  );
};

export default memo(RecentHistoryItem);
