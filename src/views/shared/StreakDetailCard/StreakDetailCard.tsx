import React, { memo, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import moment from 'moment';

import { Icon } from '_commons/components/atoms/Icon';
import { COLOR, FONT_FAMILY, FONT_SIZE, ICON, LINE_HEIGHT } from '_constants';
import { BrandLogo } from '_components/BrandLogo';
import { Text } from '_components/Text';
import { StreakModel } from '_models';
import { getFormattedTimeDiff } from '_utils/getFormattedTimeDiff';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';

export interface Props {
  streak: StreakModel.IStreak;
  brandName: string;
}

export default memo(({ streak, brandName }: Props) => {
  const { getTestIdProps } = useTestingHelper('streak-detail-card');
  const [isInProgress, setIsInProgress] = useState<boolean>(false);
  const isComplete = streak.currentQualifiedValue >= streak.thresholdValue;
  const formattedTimeDiff = getFormattedTimeDiff(streak.endDt, Date.now());
  const daysDiff = moment(streak.endDt).diff(Date.now(), 'days');
  const hasEnded = moment(streak.endDt).isSameOrBefore(Date.now());
  const criticalDayThreshold = 5;

  useEffect(() => {
    setIsInProgress(!isComplete && streak.currentQualifiedValue > 0);
  }, [isComplete, streak.currentQualifiedValue]);

  const daysDiffView = useMemo(() => {
    if (isComplete)
      return (
        <Text color={COLOR.PRIMARY_BLUE} font={FONT_FAMILY.BOLD} lineHeight={LINE_HEIGHT.SMALL} size={FONT_SIZE.PETITE} {...getTestIdProps('complete')}>
          Completed!
        </Text>
      );
    if (hasEnded) return null;
    return <Text style={[styles.progressText, daysDiff <= criticalDayThreshold && styles.progressTextWarn]}>{formattedTimeDiff} left</Text>;
  }, [isComplete, hasEnded, daysDiff, criticalDayThreshold, formattedTimeDiff, getTestIdProps]);

  return (
    <>
      <Text color={COLOR.BLACK} font={FONT_FAMILY.BOLD} lineHeight={LINE_HEIGHT.MEDIUM} size={FONT_SIZE.SMALLER}>
        {`${isInProgress ? 'Complete' : 'Activate'} a Mission now 🔥`}
      </Text>
      <Text color={COLOR.DARK_GRAY} font={FONT_FAMILY.MEDIUM} lineHeight={LINE_HEIGHT.PARAGRAPH} size={FONT_SIZE.PETITE}>
        Buy on {brandName} and earn a {streak.title} Stamp.
      </Text>
      <View style={[styles.content, (isComplete || hasEnded) && styles.completeContent]} {...getTestIdProps('container')}>
        <View style={styles.streakImageContainer}>
          <BrandLogo image={streak.imageUrl} style={styles.streakImage} size={40} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.iconListContainer}>
              {Array(streak.thresholdValue)
                .fill(null)
                .map((_, index) => {
                  const isCurrentIncomplete = index >= streak.currentQualifiedValue;
                  return (
                    <View key={`${index}-${isCurrentIncomplete}`} style={styles.icon}>
                      {isCurrentIncomplete ? (
                        <Icon name={ICON.MISSION_CIRCLE} size={FONT_SIZE.BIG} color={COLOR.DARK_GRAY} />
                      ) : (
                        <Icon name={ICON.MISSION_CIRCLE} size={FONT_SIZE.BIG} />
                      )}
                    </View>
                  );
                })}
            </View>
            <View style={styles.daysDiffContainer}>{daysDiffView}</View>
          </View>
        </View>
      </View>
    </>
  );
});
