import React from 'react';
import { View } from 'react-native';

import { Text } from '_components/Text';
import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_SIZE, ICON } from '_constants';

import { styles } from '../styles';

const icons = Object.values(ICON);

export const BasicStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>All icons (currently {icons.length})</Text>
    <View style={[styles.componentContainer, { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }]}>
      {icons.map(icon => (
        <View style={{ width: '30%', marginBottom: 40, alignItems: 'center', alignSelf: 'baseline' }}>
          <Icon name={icon} size={FONT_SIZE.BIGGER} />
          <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>{icon}</Text>
        </View>
      ))}
    </View>
  </View>
);

export const CustomColor = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Size and color variations</Text>
    <View style={[styles.componentContainer, { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }]}>
      <Icon name={ICON.FILTER_BACK_TO_SCHOOL} size={FONT_SIZE.PETITE} color={COLOR.PRIMARY_YELLOW} />
      <Icon name={ICON.FILTER_BACK_TO_SCHOOL} size={FONT_SIZE.SMALLER} color={COLOR.ORANGE} />
      <Icon name={ICON.FILTER_BACK_TO_SCHOOL} size={FONT_SIZE.SMALL} color={COLOR.RED} />
      <Icon name={ICON.FILTER_BACK_TO_SCHOOL} size={FONT_SIZE.MEDIUM} color={COLOR.PURPLE} />
      <Icon name={ICON.FILTER_BACK_TO_SCHOOL} size={FONT_SIZE.BIG} color={COLOR.GREEN} />
      <Icon name={ICON.FILTER_BACK_TO_SCHOOL} size={FONT_SIZE.BIGGER} color={COLOR.PRIMARY_LIGHT_BLUE} />
    </View>
  </View>
);

export const OverviewStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Icons</Text>
    <Text style={styles.text}>Icons have 3 props to pass: Name (required), Size and Color.</Text>
    <View style={styles.division} />
    <BasicStory />
    <View style={styles.division} />
    <CustomColor />
  </View>
);
