import React, { memo } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { Grayscale } from 'react-native-color-matrix-image-filters';
import moment from 'moment';

import { StreakModel } from '_models';
import { useTestingHelper } from '_utils/useTestingHelper';
import { getFormattedTimeDiff } from '_utils/getFormattedTimeDiff';
import { formatNumber } from '_utils/formatNumber';
import StreakIcon from '_assets/shared/streakIcon.svg';
import { ICON } from '_constants/icons';
import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_SIZE } from '_constants/styles';

import { styles } from './styles';
import { Card } from '../Card';
import { Text } from '../Text';
import { BrandLogo } from '../BrandLogo';
import { Pill } from '../Pill';

export interface Props {
  streak: StreakModel.IStreak;
  onPress?: () => void;
}

export const LargeStreakCard = ({ streak, onPress }: Props) => {
  const { getTestIdProps } = useTestingHelper('large-streak-card');

  const isComplete = streak.currentQualifiedValue >= streak.thresholdValue;
  const formattedTimeDiff = getFormattedTimeDiff(streak.endDt, Date.now());
  const hasEnded = moment(streak.endDt).isSameOrBefore(Date.now());

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress} {...getTestIdProps('container')}>
      <View style={styles.shadowContainer}>
        <Card style={styles.container} hideShadow={!onPress}>
          <View style={[styles.content, (isComplete || hasEnded) && styles.completeContent]}>
            <View style={styles.rowContainer}>
              <View>
                <Grayscale amount={isComplete ? 1 : 0}>
                  <BrandLogo image={streak.imageUrl} Fallback={StreakIcon} />
                </Grayscale>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                  {streak.title}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.iconListContainer}>
                    {Array(streak.thresholdValue)
                      .fill(null)
                      .map((_, index) => {
                        const isCurrentComplete = index >= streak.currentQualifiedValue;
                        return (
                          <View key={`${index}-${isCurrentComplete}`} style={styles.icon}>
                            {isCurrentComplete ? (
                              <Icon name={ICON.MISSION_CIRCLE} size={FONT_SIZE.MEDIUM} color={COLOR.DARK_GRAY} />
                            ) : (
                              <Icon name={ICON.MISSION_CIRCLE} size={FONT_SIZE.MEDIUM} />
                            )}
                          </View>
                        );
                      })}
                  </View>
                  {isComplete ? (
                    <Text style={styles.completeText} {...getTestIdProps('complete')}>
                      Completed!
                    </Text>
                  ) : (
                    <Text style={styles.progressText}>
                      {streak.currentQualifiedValue}/{streak.thresholdValue} purchases
                    </Text>
                  )}
                </View>
                {hasEnded ? null : (
                  <View style={styles.progressContainer}>
                    {isComplete ? <View /> : <Pill textFallback={'Mission'}>{`+${formatNumber(streak.rewardValue)}`}</Pill>}
                    {isComplete ? (
                      <Text style={styles.progressText}>Starts again in {formattedTimeDiff}</Text>
                    ) : (
                      <Text style={styles.progressText}>{formattedTimeDiff} left</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
            {hasEnded ? (
              <View style={styles.endedContainer} {...getTestIdProps('ended')}>
                <Text style={styles.progressText}>Mission has ended. New mission coming soon!</Text>
              </View>
            ) : null}
          </View>
        </Card>
      </View>
    </TouchableHighlight>
  );
};

export default memo(LargeStreakCard);
