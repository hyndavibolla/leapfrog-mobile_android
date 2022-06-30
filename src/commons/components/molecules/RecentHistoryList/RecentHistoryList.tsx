import React, { memo } from 'react';
import { Text, View, ViewStyle, StyleProp } from 'react-native';

import { RecentHistoryItem } from '../RecentHistoryItem';
import { IRecentSearchHistory, RecentSearchHistoryType } from '_models/searchHistory';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  title?: string;
  style?: StyleProp<ViewStyle>;
  visible?: boolean;
  historyList: IRecentSearchHistory[];
  onPress: (id: string | number, name: string, type: string) => void;
}

export const RecentHistoryList = ({ title, style, historyList, onPress, visible = true }: Props) => {
  const { getTestIdProps } = useTestingHelper('recent-search');

  return !historyList?.length || !visible ? null : (
    <View {...getTestIdProps('list')} style={[styles.containerSearchHistory, style]}>
      <Text style={styles.titleSearchHistory}>{title || 'Recent Search History'}</Text>
      {historyList.map(({ id, name, type }: IRecentSearchHistory) => {
        return <RecentHistoryItem key={id} onPress={() => onPress(id, name, type)} title={name} category={type === RecentSearchHistoryType.CATEGORY} />;
      })}
    </View>
  );
};

export default memo(RecentHistoryList);
