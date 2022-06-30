import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { styles } from './styles';
import { Title, TitleType } from '../Title';
import { useTestingHelper } from '../../../utils/useTestingHelper';

export interface Props {
  visible?: boolean;
  Icon?: React.FC<SvgProps>;
  title?: string;
  subtitleLine1?: string;
  subtitleLine2?: string;
  card?: boolean;
}

export const EmptyState = ({ visible = false, Icon, title, subtitleLine1, subtitleLine2, card = false }: Props) => {
  const { getTestIdProps } = useTestingHelper('empty-state');

  if (card && visible) {
    return (
      <View style={styles.emptyStateContainerHorizontal} {...getTestIdProps('card')}>
        {!Icon ? null : <Icon />}
        <View style={styles.emptyStateMessageContainerHorizontal}>
          {!title ? null : (
            <Title style={styles.emptyStateTitleHorizontal} type={TitleType.HEADER}>
              {title}
            </Title>
          )}
          {!subtitleLine1 ? null : <Text style={styles.emptyStateTextHorizontal}>{subtitleLine1}</Text>}
          {!subtitleLine2 ? null : <Text style={styles.emptyStateTextHorizontal}>{subtitleLine2}</Text>}
        </View>
      </View>
    );
  }

  return !visible ? null : (
    <View style={styles.emptyStateContainer} {...getTestIdProps('simple')}>
      <View style={styles.emptyStateMessageContainer}>
        {!Icon ? null : <Icon />}
        {!title ? null : (
          <Title style={styles.emptyStateTitle} type={TitleType.HEADER}>
            {title}
          </Title>
        )}
        {!subtitleLine1 ? null : <Text style={styles.emptyStateText}>{subtitleLine1}</Text>}
        {!subtitleLine2 ? null : <Text style={styles.emptyStateText}>{subtitleLine2}</Text>}
      </View>
    </View>
  );
};

export default memo(EmptyState);
