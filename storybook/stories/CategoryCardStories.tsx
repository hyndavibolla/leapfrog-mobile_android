import React from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';

import { styles } from '../styles';
import { CategoryCard } from '../../src/views/shared/CategoryCard';
import { CategoryList } from '../../src/views/shared/CategoryList';
import { getMissionCategory_1, getMissionCategory_2 } from '../../src/test-utils/entities';

const onPress = (message: string) => () => Alert.alert('Press', message);

export const OverviewStory = () => (
  <ScrollView style={styles.subcontainer}>
    <Text style={styles.title}>Category Card</Text>

    <Text style={styles.subtitle}>Normal state</Text>
    <View style={styles.componentContainer}>
      <CategoryCard
        image={getMissionCategory_1().imageUrl}
        label={'A really long category name that just keeps going into other lines maybe?'}
        onPress={onPress('Category Card pressed')}
        isSelected={false}
      />
    </View>

    <View style={styles.division} />

    <Text style={styles.subtitle}>Selected state</Text>
    <View style={styles.componentContainer}>
      <CategoryCard image={getMissionCategory_2().imageUrl} label={getMissionCategory_2().name} onPress={onPress('Category Card pressed')} isSelected={true} />
    </View>

    <View style={styles.division} />

    <Text style={styles.subtitle}>Selected state with long text</Text>
    <View style={styles.componentContainer}>
      <CategoryCard
        image={getMissionCategory_2().imageUrl}
        label={'A really long category name that just keeps going into other lines maybe?'}
        onPress={onPress('Category Card pressed')}
        isSelected={true}
      />
    </View>

    <View style={styles.division} />

    <Text style={styles.title}>Category List</Text>
    <View style={styles.componentContainer}>
      <CategoryList
        categoryList={[getMissionCategory_1(), getMissionCategory_2()]}
        selectedNameList={[getMissionCategory_1().name]}
        onToggle={onPress('Category Card pressed on the list')}
        onClearAll={onPress('Clear All pressed')}
        onApply={onPress('Apply pressed')}
      />
    </View>
    <View style={styles.division} />
  </ScrollView>
);
