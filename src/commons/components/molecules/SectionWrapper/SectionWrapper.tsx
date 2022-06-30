import React, { memo, ReactNode } from 'react';
import { View } from 'react-native';

import { Title, TitleType } from '_components/Title';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  title: {
    value: string;
    type?: TitleType;
  };
  children?: ReactNode;
}

const SectionWrapper = ({ title, children }: Props) => {
  const { getTestIdProps } = useTestingHelper('section-wrapper');

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Title type={title.type ?? TitleType.MAIN_SECTION} {...getTestIdProps('title')}>
            {title.value}
          </Title>
        </View>
        {children}
      </View>
    </View>
  );
};

export default memo(SectionWrapper);
