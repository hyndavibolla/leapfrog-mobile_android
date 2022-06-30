import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '_components/Text';
import { styles } from './styles';
import { ActivityModel, OfferModel } from '_models';
import ErrorBoundary from '_components/ErrorBoundary';
import { Pill } from '_components/Pill';
import { formatNumber } from '_utils/formatNumber';
import { BrandLogo } from '_components/BrandLogo';
import { useTestingHelper } from '_utils/useTestingHelper';
import { FONT_FAMILY } from '_constants';
import { formatDateToDayAndMonth } from '_utils/formatDateToDayAndMonth';
import { getActivityDisplayName } from '_utils/getActivityDisplayName';
import { useOfferAvailable } from '_utils/useOfferAvailable';
import { formatDateToMonthDayHourMins } from '_utils/formatDateToMonthDayHourMins';
import { shouldShowFeature } from '_components/Flagged';
import { FeatureFlag } from '_models/general';
import { isGiftCard } from '_utils/isGiftCard';

export interface Props {
  activity: ActivityModel.IActivity;
  offer: OfferModel.IOffer;
}

export const PointRow = ({ activity, offer }: Props) => {
  const { getTestIdProps } = useTestingHelper('point-row');

  const isOfferAvailable = useOfferAvailable(activity?.activityType, offer);

  const isGiftCardType = useMemo(() => isGiftCard(activity), [activity]);

  const titleText = useMemo(() => {
    if (offer.pointsType === OfferModel.PointsType.POINTS_EXPIRY) {
      return 'Points expired';
    }

    return getActivityDisplayName(activity, offer);
  }, [offer, activity]);

  const subtitleText = useMemo(() => {
    if (
      offer.pointsType === OfferModel.PointsType.POINTS_EXPIRY ||
      offer.programType === OfferModel.ProgramType.CARDLINK ||
      isGiftCardType ||
      (shouldShowFeature(FeatureFlag.SURVEY) && offer.programSubCategory === OfferModel.ProgramSubCategory.SURVEY) ||
      offer.programType === OfferModel.ProgramType.STREAK ||
      offer.programSubCategory === OfferModel.ProgramSubCategory.MISSION
    ) {
      return formatDateToMonthDayHourMins(activity.timestamp);
    }
    return offer.name ?? formatDateToDayAndMonth(activity.timestamp);
  }, [offer, activity, isGiftCardType]);

  const dynamicStyles = useMemo(() => {
    return StyleSheet.create({
      titlesContainer: {
        flexDirection: subtitleText ? 'column' : 'row'
      },
      title: {
        ...styles.title,
        marginBottom: !subtitleText ? 0 : 5
      }
    });
  }, [subtitleText]);

  const pillValue = useMemo(() => {
    if (!offer.points) return null;
    const isNegative =
      [ActivityModel.Type.RETURN, ActivityModel.Type.EXPIRY].includes(activity.activityType) ||
      [OfferModel.PointsType.REDEEM, OfferModel.PointsType.SURPRISE_REDEEM].includes(offer.pointsType);
    return `${isNegative ? '-' : ''}${formatNumber(Math.abs(offer.points))}`;
  }, [activity.activityType, offer.points, offer.pointsType]);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <BrandLogo
          image={activity.brandDetails?.brandLogo}
          category={offer?.pointsType || offer?.programSubCategory || offer?.programType}
          activityType={activity?.activityType}
          style={styles.logo}
          size={40}
          isGiftCard={isGiftCardType}
        />
        <View style={styles.leftColumn}>
          <View>
            {activity.activityType !== ActivityModel.Type.RETURN ? null : (
              <View style={[styles.stateContainer, styles.returnedState]}>
                <Text font={FONT_FAMILY.BOLD} style={styles.stateLabel}>
                  RETURNED
                </Text>
              </View>
            )}
          </View>
          <View style={dynamicStyles.titlesContainer}>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} ellipsizeMode="tail" font={FONT_FAMILY.SEMIBOLD} style={dynamicStyles.title} {...getTestIdProps('company-name-label')}>
                {titleText}
              </Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={1} {...getTestIdProps('description-label')}>
                {subtitleText}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <View {...getTestIdProps('points-summary-label')}>
            <Pill textFallback={'Mission'} isDisabled={!isOfferAvailable} style={styles.pill}>
              {pillValue}
            </Pill>
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
};

export default memo(PointRow);
