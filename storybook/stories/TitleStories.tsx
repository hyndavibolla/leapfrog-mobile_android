import React from 'react';
import { View } from 'react-native';

import { Text } from '../../src/views/shared/Text';
import { Title, TitleType } from '../../src/views/shared/Title';
import { styles } from '../styles';

export const TitleOverviewStory = () => (
  <>
    <View style={styles.subcontainer}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.text}>Basic title component that it is used across the app.</Text>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <Title type={TitleType.HEADER}>Header Title</Title>
      </View>
      <View style={styles.division} />
      <View style={styles.componentContainer}>
        <Title type={TitleType.SECTION}>Section Title</Title>
      </View>
    </View>
  </>
);
