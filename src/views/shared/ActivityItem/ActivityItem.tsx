import React, { memo, useMemo } from 'react';
import { View } from 'react-native-animatable';

import { styles } from './styles';
import { Text } from '_components/Text';
import { IActivity } from '_models/activity';
import { IOffer } from '_models/offer';
import { BrandLogo } from '_components/BrandLogo';
import { FONT_FAMILY } from '_constants';
import { useTestingHelper } from '_utils/useTestingHelper';
import { Pill } from '_components/Pill';
import { formatNumber } from '_utils/formatNumber';
import { ActivityModel, OfferModel } from '_models';
import { getActivityDisplayName } from '_utils/getActivityDisplayName';
import { useOfferAvailable } from '_utils/useOfferAvailable';
import { formatDateToMonthDayHourMins } from '_utils/formatDateToMonthDayHourMins';
import { shouldShowFeature } from '_components/Flagged';
import { FeatureFlag } from '_models/general';
import { isGiftCard } from '_utils/isGiftCard';

export interface Props {
  activity: IActivity;
  offer: IOffer;
}
export const ActivityItem = ({ activity, offer }: Props) => {
  const { getTestIdProps } = useTestingHelper('activity-item');

  const isOfferAvailable = useOfferAvailable(activity?.activityType, offer);
  const isGiftCardType = useMemo(() => isGiftCard(activity), [activity]);

  const chipText = activity.activityType === ActivityModel.Type.RETURN && 'RETURNED';
  const isNegative = useMemo(
    () =>
      [ActivityModel.Type.RETURN, ActivityModel.Type.EXPIRY].includes(activity.activityType) ||
      [OfferModel.PointsType.REDEEM, OfferModel.PointsType.SURPRISE_REDEEM].includes(offer.pointsType),
    [activity.activityType, offer.pointsType]
  );

  const titleText = useMemo(() => {
    if (offer.pointsType === OfferModel.PointsType.POINTS_EXPIRY) {
      return 'Points expired';
    }
    return getActivityDisplayName(activity, offer);
  }, [offer, activity]);

  const subtitleText = useMemo(() => {
    /* istanbul ignore next */
    if (
      offer.pointsType === OfferModel.PointsType.POINTS_EXPIRY ||
      (shouldShowFeature(FeatureFlag.SURVEY) && offer.programSubCategory === OfferModel.ProgramSubCategory.SURVEY) ||
      offer.programType === OfferModel.ProgramType.CARDLINK ||
      offer.programSubCategory === OfferModel.ProgramSubCategory.MISSION ||
      isGiftCardType
    ) {
      return formatDateToMonthDayHourMins(offer.pointStartDate);
    }
    return offer.name;
  }, [offer, isGiftCardType]);

  return (
    <View style={styles.container}>
      <BrandLogo
        image={activity.brandDetails?.brandLogo}
        category={offer.programSubCategory || offer.programType}
        activityType={activity?.activityType}
        style={styles.logo}
        size={40}
      />
      <View style={styles.rightColumn}>
        <View>
          {!chipText ? null : (
            <View style={[styles.stateContainer, styles.returnedState]}>
              <Text font={FONT_FAMILY.BOLD} style={styles.stateLabel}>
                {chipText}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title} {...getTestIdProps('company-name-label')}>
            {titleText}
          </Text>
        </View>
        {subtitleText ? (
          <View style={styles.subtitleContainer} {...getTestIdProps('subtitle')}>
            <Text style={styles.subtitle} ellipsizeMode="tail" numberOfLines={1} {...getTestIdProps('description-label')}>
              {subtitleText}
            </Text>
          </View>
        ) : null}
      </View>
      <View {...getTestIdProps('points-summary-label')}>
        <Pill textFallback={'Local Offer'} isDisabled={!isOfferAvailable} style={styles.pill}>
          {`${isNegative ? '-' : ''}${formatNumber(Math.abs(offer.points))}`}
        </Pill>
      </View>
    </View>
  );
};

export default memo(ActivityItem);
