import React from 'react';
import { View } from 'react-native';
import { Text } from '../../src/views/shared/Text';
import { number } from '@storybook/addon-knobs';

import { CardBenefits } from '../../src/views/shared/CardBenefits';
import { styles } from '../styles';
import { GameModel } from '../../src/models';

export const GeneralStory = () => (
  <View style={styles.subcontainer}>
    <Text style={styles.title}>Card Benefits</Text>
    <View style={styles.division} />
    <Text style={styles.title}>Onboarding</Text>
    <View style={styles.componentContainer}>
      <CardBenefits
        minimumPointsThreshold={number('minimumPointsThreshold', 0, {}, 'Onboarding')}
        maximumPointsThreshold={number('maximumPointsThreshold', 999, {}, 'Onboarding')}
        levelNumber={0}
        userPoints={0}
        reevaluationDate={new Date(2020, 6, 30)}
        subtype={GameModel.LevelState.SAFE}
      />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>Safe Zone</Text>
    <View style={styles.componentContainer}>
      <CardBenefits
        minimumPointsThreshold={number('minimumPointsThreshold', 30000, {}, 'SafeZone')}
        maximumPointsThreshold={number('maximumPointsThreshold', 34999, {}, 'SafeZone')}
        levelNumber={6}
        userPoints={32500}
        reevaluationDate={new Date(2020, 7, 30)}
        subtype={GameModel.LevelState.SAFE}
      />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>Relegation</Text>
    <View style={styles.componentContainer}>
      <CardBenefits
        minimumPointsThreshold={number('minimumPointsThreshold', 1000, {}, 'Relegation')}
        maximumPointsThreshold={number('maximumPointsThreshold', 2999, {}, 'Relegation')}
        levelNumber={1}
        userPoints={1450}
        reevaluationDate={new Date(2020, 7, 30)}
        subtype={GameModel.LevelState.RELEGATION}
      />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>Promotion</Text>
    <View style={styles.componentContainer}>
      <CardBenefits
        minimumPointsThreshold={number('minimumPointsThreshold', 1000, {}, 'Relegation')}
        maximumPointsThreshold={number('maximumPointsThreshold', 2999, {}, 'Relegation')}
        levelNumber={1}
        userPoints={1450}
        reevaluationDate={new Date(2020, 7, 30)}
        subtype={GameModel.LevelState.PROMOTION}
      />
    </View>
    <View style={styles.division} />
    <Text style={styles.title}>Special</Text>
    <View style={styles.componentContainer}>
      <CardBenefits
        minimumPointsThreshold={number('minimumPointsThreshold', 20000, {}, 'Special')}
        maximumPointsThreshold={number('maximumPointsThreshold', 25000, {}, 'Special')}
        levelNumber={5}
        userPoints={25000}
        reevaluationDate={new Date(2020, 7, 30)}
        subtype={GameModel.LevelState.SPECIAL}
      />
    </View>
  </View>
);
