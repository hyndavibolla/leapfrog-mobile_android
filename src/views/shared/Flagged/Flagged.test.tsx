import React from 'react';
import { View } from 'react-native';
import { Text } from '../Text';
import { render } from '@testing-library/react-native';

import Flagged, { shouldShowFeature } from './Flagged';
import { FeatureFlag } from '../../../models/general';

describe('Flagged', () => {
  it('should tell if a feature should be shown', () => {
    expect(shouldShowFeature(FeatureFlag.TEST_ONLY)).toBeTruthy();
    expect(shouldShowFeature(FeatureFlag.ENV_BANNER)).toBeFalsy();
  });

  it('should show features depending on the env', () => {
    const { toJSON } = render(
      <View>
        <Flagged feature={FeatureFlag.TEST_ONLY}>
          <Text>this should be on the snap</Text>
        </Flagged>
        <Flagged feature={FeatureFlag.ENV_BANNER}>
          <Text>this should NOT be on the snap</Text>
        </Flagged>
      </View>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
