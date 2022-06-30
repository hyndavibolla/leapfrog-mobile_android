import React, { memo } from 'react';
import { TouchableHighlight, View } from 'react-native';

import { MissionModel } from '_models';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Card } from '_components/Card';
import { Text } from '_components/Text';
import { ImageBackgroundWithFallback } from '_components/ImageBackgroundWithFallback';
import { Icon } from '_commons/components/atoms/Icon';
import { ICON, FONT_SIZE } from '_constants';

import { styles } from './styles';

export interface Props {
  survey: MissionModel.IMission;
  onPress?: () => void;
}

export const LargeSurveyCard = ({ survey, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('large-survey-card');

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <View style={styles.shadowContainer}>
        <Card style={styles.container}>
          <View style={styles.content}>
            <ImageBackgroundWithFallback
              containerStyle={styles.mainImage}
              source={require('_assets/shared/surveyCardBackground.png')}
              fallbackSource={require('_assets/shared/imageBackgroundLarge.png') /** using a fallback in case we change this to be dynamic */}
            >
              <View style={styles.imageContent}>
                <Text style={styles.title}>{survey.name}</Text>
                <View style={styles.ctaContainer}>
                  <Text style={styles.cta}>Go to Surveys</Text>
                  <Icon name={ICON.ARROW_RIGHT} size={FONT_SIZE.MEDIUM} />
                </View>
              </View>
            </ImageBackgroundWithFallback>
          </View>
        </Card>
      </View>
    </TouchableHighlight>
  );
};

export default memo(LargeSurveyCard);
