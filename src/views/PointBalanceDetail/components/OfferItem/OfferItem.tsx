import React, { memo, useMemo } from 'react';
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native';
import moment from 'moment';

import ErrorBoundary from '_components/ErrorBoundary';
import { Text } from '_components/Text';
import { FONT_FAMILY } from '_constants';
import { ActivityModel, OfferModel } from '_models';
import { useTestingHelper } from '_utils/useTestingHelper';
import { isGiftCard } from '_utils/isGiftCard';
import { GiftCardPointRow } from '../GiftCardPointRow';
import { PointRow } from '../PointRow';
import { styles } from './styles';

export interface Props {
  shouldShowSeparator: boolean;
  activity: ActivityModel.IActivity;
  onPress: (set: [ActivityModel.IActivity, OfferModel.IOffer]) => void;
  titleStyle?: StyleProp<TextStyle>;
}

export const OfferItem = ({ shouldShowSeparator, activity, onPress, titleStyle }: Props) => {
  const { getTestIdProps } = useTestingHelper('offer-item');
  const date = useMemo(() => moment(activity?.timestamp), [activity?.timestamp]);
  const format = useMemo(() => (date.format('YYYY') < moment(Date.now()).format('YYYY') ? 'MMMM YYYY' : 'MMMM'), [date]);
  const giftCardWithoutRedeem = useMemo(
    () => isGiftCard(activity) && (!activity.offers?.length || activity.offers.every(offer => offer.pointsType !== OfferModel.PointsType.REDEEM)),
    [activity]
  );

  return (
    <ErrorBoundary>
      {shouldShowSeparator && (
        <Text font={FONT_FAMILY.BOLD} style={[styles.separatorLabel, titleStyle]} {...getTestIdProps('separator')}>
          {date.isValid() && date.format(format).toUpperCase()}
        </Text>
      )}
      {activity.offers?.map((offer, index) => (
        <TouchableOpacity key={index} onPress={() => onPress([activity, offer])} {...getTestIdProps('activity-row')}>
          <PointRow activity={activity} offer={offer} />
        </TouchableOpacity>
      ))}
      {giftCardWithoutRedeem && (
        <TouchableOpacity onPress={() => onPress([activity, null])} {...getTestIdProps('activity-gc-row')}>
          <GiftCardPointRow activity={activity} />
        </TouchableOpacity>
      )}
    </ErrorBoundary>
  );
};

export default memo(OfferItem);
