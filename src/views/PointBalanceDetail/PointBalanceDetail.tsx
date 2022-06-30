import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

import { EmptyState } from '_components/EmptyState';
import { ActivityModel } from '_models';
import { DateLike, FeatureFlag } from '_models/general';
import { sortByDate } from '_utils/sortByDate';
import { useDebounce } from '_utils/useDebounce';
import { getDateDiffInDays } from '_utils/getDateDiffInDays';
import { getNextPointsToExpire } from '_utils/getNextPointsToExpire';
import { formatNumber } from '_utils/formatNumber';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useGetActivity, useGetCurrentGame } from '_state_mgmt/game/hooks';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { usePNPrompt } from '_state_mgmt/core/hooks';
import { ROUTES, ICON, COLOR, FONT_SIZE } from '_constants';
import GoOutIcon from '_assets/shared/goOutIcon.svg';
import InfoIcon from '_assets/shared/moreInfo.svg';
import CartFallback from '_assets/shared/circleCartError.svg';
import { Card } from '_components/Card';
import { Text } from '_components/Text';
import { Divider } from '_components/Divider';
import { Title } from '_components/Title';
import { Flagged } from '_components/Flagged';
import { ActivityList } from '_components/ActivityList';
import { Icon } from '_commons/components/atoms/Icon';

import { PointBalanceDetailSkeleton } from './components/PointBalanceDetailSkeleton';
import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
}

export const PointBalanceDetail = ({ navigation }: Props) => {
  const { getTestIdProps } = useTestingHelper('point-balance-detail');
  const { state } = useContext(GlobalContext);
  const { current: currentGame } = state.game;
  const [fetchActivityList, isLoadingActivities = true, activitiesError, fetchedList = []] = useGetActivity();
  const [onGetCurrentGame, , gameError] = useGetCurrentGame();
  const [activityList, setActivityList] = useState<(ActivityModel.IActivity & { uuid: string })[]>([]);
  const [prevLastTimestamp, setPrevLastTimestamp] = useState<DateLike>(null);
  const hasError = !!gameError;
  /** some arbitrary debounce is needed to cover the time windows between loading ends and activities are reflected on the state */
  const debouncedIsLoadingActivities = useDebounce(isLoadingActivities, 50);
  const isLoading = debouncedIsLoadingActivities || isLoadingActivities;
  const isListEmpty = !isLoading && !activityList.length;
  const [onPNPrompt] = usePNPrompt();

  const onLoadMore = async () => {
    /* istanbul ignore next line - Can't be tested as container won't render until first search concludes */
    if (!prevLastTimestamp) return;
    const activities = await fetchActivityList(prevLastTimestamp);
    const lastTimestamp = activities[0]?.timestamp;
    setPrevLastTimestamp(lastTimestamp);
  };

  const nextPointsToExpire = useMemo(() => getNextPointsToExpire(currentGame.balance.memberOwnPointsToExpire), [currentGame.balance.memberOwnPointsToExpire]);
  const diffInDays = getDateDiffInDays(Date.now(), nextPointsToExpire?.memberOwnExpiryDate);

  const expirePointsTitle = useMemo(() => {
    if (!nextPointsToExpire) {
      return (
        <Text style={styles.headerCardTitle} {...getTestIdProps('expire-points-none')}>
          Treat yourself!
        </Text>
      );
    }

    if (!nextPointsToExpire.memberOwnPoints || Number.isNaN(diffInDays)) {
      return (
        <View style={styles.headerCardPointsTitleContainer}>
          <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.SMALLER} />
          <Text style={styles.headerCardPointsTitle} {...getTestIdProps('expire-points-number-error')}>
            -
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.headerCardPointsTitleContainer}>
        <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.SMALLER} />
        <Text style={styles.headerCardPointsTitle} {...getTestIdProps('expire-points-some')}>
          {formatNumber(nextPointsToExpire.memberOwnPoints)}
        </Text>
      </View>
    );
  }, [nextPointsToExpire, getTestIdProps, diffInDays]);

  const expirePointsSubtitle = useMemo(() => {
    if (!nextPointsToExpire) {
      return (
        <Text style={styles.headerCardSubtitle} {...getTestIdProps('expire-points-default')}>
          View rewards
        </Text>
      );
    }

    if (!nextPointsToExpire.memberOwnExpiryDate || Number.isNaN(diffInDays)) {
      return (
        <Text style={[styles.headerCardSubtitle, styles.headerCardPointsSubtitle]} {...getTestIdProps('expire-points-date-error')}>
          Expire on -
        </Text>
      );
    }

    if (diffInDays < 1 && diffInDays >= 0) {
      return (
        <Text style={[styles.headerCardSubtitle, styles.headerCardPointsSubtitle]} {...getTestIdProps('expire-points-today')}>
          Expire today. Redeem before it’s too late!
        </Text>
      );
    }

    if (diffInDays < 2) {
      return (
        <Text style={[styles.headerCardSubtitle, styles.headerCardPointsSubtitle]} {...getTestIdProps('expire-points-tomorrow')}>
          Expire tomorrow. Spend them now!
        </Text>
      );
    }

    if (diffInDays < 30) {
      return (
        <Text style={[styles.headerCardSubtitle, styles.headerCardPointsSubtitle]} {...getTestIdProps('expire-points-month')}>
          Expire in {diffInDays} days.
        </Text>
      );
    }

    return (
      <Text style={[styles.headerCardSubtitle, styles.headerCardPointsSubtitle]} {...getTestIdProps('expire-points-future')}>
        Expire on {moment(nextPointsToExpire.memberOwnExpiryDate).format('MMM D, YYYY')}
      </Text>
    );
  }, [nextPointsToExpire, getTestIdProps, diffInDays]);

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <Card style={styles.headerCard}>
          <View style={styles.cardInfoContainer}>
            <View>
              <View style={styles.balanceTextContainer}>
                <Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.SMALLER} />
                <Text style={styles.availablePointsText}>{formatNumber(currentGame.balance.availablePoints)}</Text>
              </View>
              <Text style={styles.headerCardSubtitle}>Available Points Balance</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.HOW_IT_WORKS.TITLE)} {...getTestIdProps('info-btn')}>
              <View style={styles.iconContainer}>
                <InfoIcon />
              </View>
            </TouchableOpacity>
          </View>
          <Divider />
          <View>
            <View style={styles.balanceTextContainer}>
              <Icon name={ICON.LOCK} color={COLOR.DARK_GRAY} size={FONT_SIZE.MEDIUM} />
              <Text style={styles.pendingPointsText}>{formatNumber(currentGame.balance.pendingPoints)}</Text>
            </View>
            <Text style={styles.headerCardSubtitle}>Pending Points Balance</Text>
          </View>
        </Card>
        <Title style={styles.title}>Rewards</Title>
        <Card style={styles.headerCard}>
          <TouchableOpacity onPress={() => navigation.navigate(ROUTES.MAIN_TAB.REWARDS)} {...getTestIdProps('rewards-btn')}>
            <View style={styles.cardInfoContainer}>
              <View>
                {expirePointsTitle}
                {expirePointsSubtitle}
              </View>
              <Icon name={ICON.REWARDS_GIFT_CARDS} color={COLOR.DARK_GRAY} size={FONT_SIZE.MEDIUM} />
            </View>
          </TouchableOpacity>
          <Flagged feature={FeatureFlag.STREAK_REDEEM_CARD}>
            <Divider />
            <View style={styles.cardInfoContainer}>
              <View>
                <Text style={styles.headerCardSubtitle}>You can also redeem points on{' \n'}Shop Your Way Redemption Partners</Text>
              </View>
              <GoOutIcon />
            </View>
          </Flagged>
        </Card>
        <View style={styles.rowContainer}>
          <Title>Latest Transactions</Title>
          {!isLoading && !isListEmpty && (
            <Flagged feature={FeatureFlag.SEE_ALL_TRANSACTIONS}>
              <TouchableOpacity onPress={() => navigation.navigate(ROUTES.TRANSACTION_FILTERS.MAIN)} {...getTestIdProps('see-all-btn')}>
                <Text style={styles.link}>See all</Text>
              </TouchableOpacity>
            </Flagged>
          )}
        </View>
      </View>
    ),
    [currentGame, isLoading, isListEmpty, expirePointsTitle, expirePointsSubtitle, getTestIdProps, navigation]
  );

  useEffect(() => {
    const newBatch = fetchedList
      .sort(sortByDate('timestamp'))
      .filter(activity => !prevLastTimestamp || activity.timestamp < prevLastTimestamp)
      .reverse()
      .map((a, i) => ({ ...a, uuid: `${Date.now()}-${i}}` }));
    if (newBatch.length) setActivityList(prev => [...prev, ...newBatch]);
  }, [fetchedList, prevLastTimestamp]);

  useEffect(() => {
    fetchActivityList(Date.now()).then(activities => {
      const lastTimestamp = activities[0]?.timestamp;
      setPrevLastTimestamp(lastTimestamp);
    });
    onGetCurrentGame(true);
  }, [fetchActivityList, onGetCurrentGame]);

  useEffect(() => {
    onPNPrompt();
  }, [onPNPrompt]);

  if (hasError) {
    return (
      <View style={styles.fallbackContainer}>
        <EmptyState
          visible
          Icon={CartFallback}
          title="We couldn't load your transactions"
          subtitleLine1={'Sorry, something went wrong \n We are working to find a solution. \n Come back later!'}
        />
      </View>
    );
  }
  if (!activityList.length && isLoadingActivities) return <PointBalanceDetailSkeleton />;

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      <ActivityList
        showTransactionFallback
        activityList={activityList}
        activitiesError={activitiesError}
        onLoadMore={onLoadMore}
        isListEmpty={isListEmpty}
        isLoadingActivities={isLoadingActivities}
        ListHeaderComponent={ListHeaderComponent}
      />
    </View>
  );
};

export default memo(PointBalanceDetail);
