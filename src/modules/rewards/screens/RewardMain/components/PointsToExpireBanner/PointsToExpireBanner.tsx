import React, { memo, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { Icon } from '_commons/components/atoms/Icon';

import { useTestingHelper } from '_utils/useTestingHelper';

import { PointsToExpire } from '_models/game';
import { IExpirePointsBannerDataSet } from '_models/general';
import { useExpirePointsBannerDataSet } from '_state_mgmt/core/hooks';

import { formatNumber } from '_utils/formatNumber';
import { getDateDiffInDays } from '_utils/getDateDiffInDays';
import { getNextPointsToExpire } from '_utils/getNextPointsToExpire';
import { ICON } from '_constants/icons';
import { COLOR, FONT_SIZE } from '_constants/styles';
import { ENV } from '_constants/env';

import { styles } from './styles';

const maxDaysExpireBanner = Math.max(...ENV.POINTS_EXPIRE_BANNER_THRESHOLD_LIST);
export interface Props {
  memberOwnPointsToExpire: PointsToExpire[];
  expirePointsBannerDataSet: IExpirePointsBannerDataSet;
}

export const PointsToExpireBanner = ({ memberOwnPointsToExpire, expirePointsBannerDataSet }: Props) => {
  const { getTestIdProps } = useTestingHelper('reward-banner');
  const { setExpirePointsBannerDataSet } = useExpirePointsBannerDataSet();
  const nextPointsToExpire = getNextPointsToExpire(memberOwnPointsToExpire);
  const pointsDiffInDays = getDateDiffInDays(Date.now(), nextPointsToExpire?.memberOwnExpiryDate);

  const shouldShowBanner = useMemo(() => {
    const diffLastDays = getDateDiffInDays(expirePointsBannerDataSet?.lastAcceptedDate, nextPointsToExpire?.memberOwnExpiryDate);
    if (nextPointsToExpire?.memberOwnExpiryDate && expirePointsBannerDataSet?.lastAcceptedDate) {
      if (pointsDiffInDays > maxDaysExpireBanner || (pointsDiffInDays === 0 && diffLastDays === 0) || (pointsDiffInDays === 1 && diffLastDays === 1))
        return false;
      else if (pointsDiffInDays > 1 && pointsDiffInDays <= 15 && diffLastDays > 1 && diffLastDays <= 15) return false;
      else return true;
    } else if (expirePointsBannerDataSet?.lastAcceptedDate) return false;
    else return true;
  }, [expirePointsBannerDataSet, nextPointsToExpire?.memberOwnExpiryDate, pointsDiffInDays]);

  const expirationDate = () => {
    if (pointsDiffInDays === 0) return 'today';
    if (pointsDiffInDays === 1) return 'tomorrow';
    else return `in ${pointsDiffInDays} days`;
  };

  if (!shouldShowBanner) return null;

  return (
    <View style={styles.shadowContainer} {...getTestIdProps('container')}>
      <View style={styles.container}>
        <TouchableOpacity {...getTestIdProps('close-banner')} onPress={setExpirePointsBannerDataSet} style={styles.closeIcon}>
          <Icon name={ICON.CLOSE} size={FONT_SIZE.BIG} color={COLOR.BLACK} />
        </TouchableOpacity>
        {pointsDiffInDays <= 15 && memberOwnPointsToExpire?.length && nextPointsToExpire?.memberOwnPoints ? (
          <>
            <Image source={require('_assets/shared/pointsExpireFire.png')} style={styles.fireIcon as any} />
            <Text style={styles.title}>
              Your {formatNumber(nextPointsToExpire?.memberOwnPoints)} points expire <Text {...getTestIdProps('expiration-date')}>{expirationDate()}</Text>
            </Text>
            <Text style={styles.subtitle}>Turn your points into your favorite Gift Cards by redeeming your points now.</Text>
          </>
        ) : (
          <>
            <View {...getTestIdProps('turn-points-icon')} style={styles.iconContainer}>
              <Icon name={ICON.REWARDS_GIFT_CARDS} size={FONT_SIZE.REGULAR_2X} color={COLOR.PRIMARY_BLUE} />
            </View>
            <Text style={styles.title}>Turn points into Gift Cards</Text>
            <Text style={styles.subtitle}>Buy from the brands you love. Earn points. Then turn those points into Gift Cards.{'\n'}It’s that simple.</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default memo(PointsToExpireBanner);
