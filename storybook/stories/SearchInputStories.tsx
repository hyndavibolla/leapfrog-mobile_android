import React from 'react';
import { Alert, View } from 'react-native';
import { text, number, boolean } from '@storybook/addon-knobs';
import { useState } from '@storybook/addons';

import { Text } from '../../src/views/shared/Text';
import { SearchInput } from '../../src/views/shared/SearchInput';
import { styles } from '../styles';

export const SearchInputStory = () => {
  const onPress = () => Alert.alert('Event detected', 'Filters button pressed!');
  const [value, setValue] = useState('');

  return (
    <>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Search Input</Text>
        <Text style={styles.text}>This component is used to filter.</Text>
        <View style={styles.division} />
        <View style={styles.componentContainer}>
          <SearchInput
            placeholder={text('placeholder', 'Search Brands, Categories')}
            onFilterPress={onPress}
            filtersActive={number('filtersActive', 0)}
            value={value}
            onChange={setValue}
            disabled={boolean('disabled', false)}
          />
        </View>
        <View style={styles.division} />
        <View>
          <Text style={styles.text}>Latest search term was: {value}</Text>
        </View>
        <View style={styles.division} />
        <Text style={styles.subtitle}>Search Input with active filters</Text>
        <View style={styles.componentContainer}>
          <SearchInput
            placeholder={text('placeholder', 'Search Brands, Categories')}
            onFilterPress={onPress}
            filtersActive={1}
            value={value}
            onChange={setValue}
            disabled={boolean('disabled', false)}
          />
        </View>
      </View>
    </>
  );
};
