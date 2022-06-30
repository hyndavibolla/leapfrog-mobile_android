import React, { memo } from 'react';
import { View } from 'react-native-animatable';

import { Title } from '_components/Title';
import { Text } from '_components/Text';

import WarningSection from '_assets/shared/warningSection.svg';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

const SectionError = () => {
  const { getTestIdProps } = useTestingHelper('section-error');

  return (
    <View style={styles.container} {...getTestIdProps('component')}>
      <View style={styles.iconSection}>
        <WarningSection height={70} width={70} />
      </View>
      <View style={styles.textSection}>
        <Title>We couldn't load this section</Title>
        <Text>At the meantime, you can explore our catalog 🚀</Text>
      </View>
    </View>
  );
};

export default memo(SectionError);
