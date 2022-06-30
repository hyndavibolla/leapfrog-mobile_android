import React, { memo, ComponentProps } from 'react';
import { View, TouchableHighlight } from 'react-native';

import { Title, TitleType } from '_components/Title';

import { styles } from './styles';

export interface Props {
  title: string;
  shouldShowSeeAll: boolean;
  seeAllProps?: ComponentProps<typeof TouchableHighlight>;
}

export const SectionHeader = memo(({ title, shouldShowSeeAll, seeAllProps }: Props) => {
  return (
    <View style={styles.sectionHeader}>
      <Title numberOfLines={1} ellipsizeMode="tail" type={TitleType.SECTION}>
        {title}
      </Title>
      {!shouldShowSeeAll ? null : (
        <TouchableHighlight underlayColor="transparent" {...seeAllProps}>
          <Title style={styles.link} type={TitleType.SECTION}>
            See all
          </Title>
        </TouchableHighlight>
      )}
    </View>
  );
});

export default SectionHeader;
