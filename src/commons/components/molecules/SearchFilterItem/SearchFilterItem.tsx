import React, { memo } from 'react';
import { TouchableHighlight, View, Text } from 'react-native';

import { useTestingHelper } from '_utils/useTestingHelper';

import { Icon } from '_commons/components/atoms/Icon';
import { ICON } from '_constants/icons';
import { FONT_SIZE } from '_constants/styles';

import { styles } from './styles';

export interface Props {
  identifier: string;
  onPress: () => void;
  isSelected: boolean;
  title: string;
}

export const SearchFilterItem = ({ identifier, onPress, isSelected, title }: Props) => {
  const { getTestIdProps } = useTestingHelper('filter-item');

  return (
    <TouchableHighlight underlayColor="transparent" {...getTestIdProps(`category-${identifier}-btn`)} onPress={onPress}>
      <View style={[styles.optionContainer, isSelected && styles.optionContainerSelected]}>
        <Text style={[styles.option, isSelected && styles.optionSelected]}> {title}</Text>
        {isSelected && (
          <View style={styles.checkContainerBackground}>
            <Icon name={ICON.TICK_CIRCLE} size={FONT_SIZE.REGULAR} />
          </View>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default memo(SearchFilterItem);
