import React, { memo, useCallback, useContext, useMemo } from 'react';
import { View, ScrollView } from 'react-native';

import CardIcon from '_assets/shared/cardIconBlue.svg';
import Warning from '_assets/shared/warningStatus.svg';
import { Icon } from '_commons/components/atoms/Icon';
import { BrandLogo } from '_components/BrandLogo';
import { Divider } from '_components/Divider';
import { shouldShowFeature } from '_components/Flagged';
import { Pill } from '_components/Pill';
import { Text } from '_components/Text';
import { COLOR, FONT_FAMILY, FONT_SIZE, ICON } from '_constants';
import { ActivityModel, OfferModel } from '_models';
import { getStatusDisplayText } from '_models/activity';
import { FeatureFlag } from '_models/general';
import { formatDateToMonthDayHourMins } from '_utils/formatDateToMonthDayHourMins';
import { formatNumber } from '_utils/formatNumber';
import { getActivityDisplayName } from '_utils/getActivityDisplayName';
import { isGiftCard } from '_utils/isGiftCard';
import { getFixedValueWithDecimals } from '_utils/getFixedValueWithDecimals';
import { useOfferAvailable } from '_utils/useOfferAvailable';
import { useTestingHelper } from '_utils/useTestingHelper';

import { styles } from './styles';
import { ActivityDetailRow } from '../ActivityDetailRow';
import { GlobalContext } from '_state_mgmt/GlobalState';

export interface Props {
  activity: ActivityModel.IActivity;
  offer?: OfferModel.IOffer;
}

export const ActivityDetail = ({ activity, offer }: Props) => {
  const { getTestIdProps } = useTestingHelper('activity-detail');
  const { state } = useContext(GlobalContext);
  const pointsPerCent = state.game.current.missions.pointsPerCent;

  const { timestamp, brandDetails } = activity;
  const isOfferAvailable = useOfferAvailable(activity.activityType, offer);
  const isNegative = useMemo(
    () =>
      [ActivityModel.Type.RETURN, ActivityModel.Type.EXPIRY].includes(activity.activityType) ||
      [OfferModel.PointsType.REDEEM, OfferModel.PointsType.SURPRISE_REDEEM].includes(offer?.pointsType),
    [activity.activityType, offer?.pointsType]
  );
  const isGiftCardType = useMemo(() => isGiftCard(activity), [activity]);
  const dontShowStatus = useMemo(() => offer?.programType === OfferModel.ProgramType.STREAK || isGiftCardType, [offer?.programType, isGiftCardType]);
  const timestampValue = useMemo(() => (timestamp ? formatDateToMonthDayHourMins(timestamp) : null), [timestamp]);

  const convertPointsToUsd = useCallback((points: number) => Math.abs(points) / (pointsPerCent * 100), [pointsPerCent]);

  const status = useMemo(() => {
    return dontShowStatus ? null : (
      <>
        <Divider containerStyle={styles.dividerContainer} />
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            {activity.activityType === ActivityModel.Type.RETURN ? <Warning width={25} height={25} /> : <Icon name={ICON.TICK_CIRCLE} size={FONT_SIZE.BIG} />}
          </View>
          <View>
            <Text font={FONT_FAMILY.BOLD} style={styles.infoTitle}>
              STATUS
            </Text>
            {(() => {
              switch (activity.activityType) {
                case ActivityModel.Type.EXPIRY:
                  return <Text style={styles.infoText}>Points Expired</Text>;
                case ActivityModel.Type.RETURN:
                  return (
                    <View style={[styles.stateContainer, styles.returnedState]}>
                      <Text style={styles.stateLabel}>RETURNED</Text>
                    </View>
                  );
                default:
                  return (
                    <Text style={styles.infoText} {...getTestIdProps('status-modal-label')}>
                      {getStatusDisplayText(activity.activityType, offer)}
                    </Text>
                  );
              }
            })()}
          </View>
        </View>
      </>
    );
  }, [dontShowStatus, activity.activityType, offer, getTestIdProps]);

  const pointsPill = useMemo(() => {
    return offer?.points ? (
      <View style={styles.containerPill} {...getTestIdProps('points-summary-modal-label')}>
        <Pill textFallback={'Mission'} isDisabled={!isOfferAvailable} style={[styles.pill]}>
          {`${isNegative ? '-' : ''}${formatNumber(Math.abs(offer.points))}`}
        </Pill>
      </View>
    ) : null;
  }, [getTestIdProps, isNegative, isOfferAvailable, offer]);

  const totalOrderValue = useMemo(() => {
    if (!isGiftCardType) return;
    return offer?.dollarRedeemed
      ? offer?.dollarRedeemed
      : activity?.grossSpend
      ? activity?.grossSpend
      : activity.activityDetails?.giftCardValue
      ? activity.activityDetails?.giftCardValue
      : convertPointsToUsd(offer?.points);
  }, [activity.activityDetails?.giftCardValue, activity?.grossSpend, convertPointsToUsd, isGiftCardType, offer?.dollarRedeemed, offer?.points]);

  const paymentMethodValue = useMemo(() => {
    if (!isGiftCardType) return;
    if (!activity.offers?.length || activity.offers.every(currentOffer => currentOffer.pointsType !== OfferModel.PointsType.REDEEM)) return 'Credit Card';
    const totalRedeemPoints = activity.offers.reduce(
      (previousValue, currentOffer) => (currentOffer.pointsType === OfferModel.PointsType.REDEEM ? previousValue + currentOffer.points : previousValue),
      0
    );
    if (
      (activity?.grossSpend && activity?.grossSpend - convertPointsToUsd(totalRedeemPoints) > 0) ||
      (activity.activityDetails?.giftCardValue && activity.activityDetails?.giftCardValue - convertPointsToUsd(totalRedeemPoints) > 0)
    )
      return 'Points + Credit Card';
    return 'Points Only';
  }, [activity.activityDetails?.giftCardValue, activity?.grossSpend, activity.offers, convertPointsToUsd, isGiftCardType]);

  return (
    <ScrollView style={styles.container} {...getTestIdProps('container')}>
      <View style={styles.logoContainer}>
        <BrandLogo
          image={brandDetails?.brandLogo}
          category={offer?.pointsType || offer?.programSubCategory || offer?.programType}
          activityType={activity?.activityType}
          isGiftCard={isGiftCardType}
        />
      </View>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.activityName, !offer?.points && styles.noPointsMargin]}
        {...getTestIdProps('company-name-modal-label')}
      >
        {(() => {
          if (offer?.pointsType === OfferModel.PointsType.POINTS_EXPIRY) return 'Points expired';
          if (offer?.programType === OfferModel.ProgramType.STREAK) return 'Mission Completed';
          if (shouldShowFeature(FeatureFlag.SURVEY) && offer?.programSubCategory === OfferModel.ProgramSubCategory.SURVEY) return 'Surveys';
          return getActivityDisplayName(activity, offer);
        })()}
      </Text>
      {offer?.pointsType === OfferModel.PointsType.REDEEM ||
      offer?.pointsType === OfferModel.PointsType.POINTS_EXPIRY ||
      !offer ||
      (shouldShowFeature(FeatureFlag.SURVEY) && offer.programSubCategory === OfferModel.ProgramSubCategory.SURVEY) ? null : (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.activityDescription} {...getTestIdProps('company-description-modal-label')}>
          {offer.programType === OfferModel.ProgramType.CARDLINK ? 'Local Offer Purchase' : offer.name}
        </Text>
      )}
      {pointsPill}
      {status}
      {isGiftCardType && totalOrderValue && (
        <ActivityDetailRow
          title="TOTAL ORDER"
          value={`$${getFixedValueWithDecimals(totalOrderValue, 2)}`}
          icon={<Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.BIG} />}
          testIdProps={{ ...getTestIdProps('total-order') }}
        />
      )}
      {timestamp && (
        <ActivityDetailRow
          title="TRANSACTION DATE"
          value={timestampValue}
          icon={<Icon name={ICON.CALENDAR} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.MEDIUM} />}
          testIdProps={{ ...getTestIdProps('transaction-date') }}
        />
      )}
      {isGiftCardType && paymentMethodValue && (
        <ActivityDetailRow
          title="PAYMENT METHOD"
          value={paymentMethodValue}
          icon={<CardIcon width={25} height={25} />}
          testIdProps={{ ...getTestIdProps('payment-method') }}
        />
      )}
      {!offer || !offer?.pointStartDate || offer?.programType === OfferModel.ProgramType.STREAK ? null : (
        <>
          <Divider containerStyle={styles.dividerContainer} />
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Icon name={ICON.CALENDAR_TICK} color={COLOR.PRIMARY_BLUE} size={FONT_SIZE.MEDIUM} />
            </View>
            <View>
              <Text font={FONT_FAMILY.BOLD} style={styles.infoTitle}>
                AVAILABLE
              </Text>
              <Text style={styles.infoText}>{formatDateToMonthDayHourMins(offer.pointStartDate)}</Text>
            </View>
          </View>
        </>
      )}
      <Divider containerStyle={styles.dividerContainer} />
    </ScrollView>
  );
};

export default memo(ActivityDetail);
