import React, { memo, useMemo } from 'react';
import { View } from 'react-native';

import { BrandLogo } from '_components/BrandLogo';
import ErrorBoundary from '_components/ErrorBoundary';
import { Text } from '_components/Text';
import { FONT_FAMILY } from '_constants';
import { ActivityModel } from '_models';
import { formatDateToMonthDayHourMins } from '_utils/formatDateToMonthDayHourMins';
import { getBrandName } from '_utils/mapBrand';
import { useTestingHelper } from '_utils/useTestingHelper';
import { styles } from './styles';

export interface Props {
  activity: ActivityModel.IActivity;
}

export const GiftCardPointRow = ({ activity }: Props) => {
  const { getTestIdProps } = useTestingHelper('giftcard-point-row');

  const titleText = useMemo(() => {
    return activity.requestorName ? `${getBrandName(activity.requestorName)} Gift Card` : 'Gift Card purchase';
  }, [activity.requestorName]);

  const subtitleText = useMemo(() => {
    return activity.timestamp ? `${formatDateToMonthDayHourMins(activity.timestamp)} - CC Purchased` : 'CC Purchased';
  }, [activity.timestamp]);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <BrandLogo image={activity.brandDetails?.brandLogo} activityType={activity?.activityType} style={styles.logo} size={40} isGiftCard />
        <View style={styles.leftColumn}>
          <View style={styles.titlesContainer}>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} ellipsizeMode="tail" font={FONT_FAMILY.SEMIBOLD} style={styles.title} {...getTestIdProps('company-name-label')}>
                {titleText}
              </Text>
            </View>
            <View>
              <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={1} {...getTestIdProps('description-label')}>
                {subtitleText}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
};

export default memo(GiftCardPointRow);
