import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

import CartFallback from '_assets/shared/circleCartError.svg';
import { Icon } from '_commons/components/atoms/Icon';
import { ActivityList } from '_components/ActivityList';
import { EmptyState } from '_components/EmptyState';
import { Pill } from '_components/Pill';
import { COLOR, FONT_SIZE, ICON } from '_constants';
import { transactionFilterMenuItems } from '_constants/transactionFilter';
import { IActivity } from '_models/activity';
import { DateLike } from '_models/general';
import { ProgramType, PointsType, TransactionFilter } from '_models/offer';
import { useGetActivity } from '_state_mgmt/game/hooks';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useDebounce } from '_utils/useDebounce';
import { sortByDate } from '_utils/sortByDate';
import { isGiftCard } from '_utils/isGiftCard';

import { styles } from './styles';

const MINIMUM_ITEM_SIZE = 100;

interface RouteParams {
  params: {
    filterName: TransactionFilter;
  };
}

export interface Props {
  route?: RouteParams;
}

export const TransactionFilters = ({ route }: Props) => {
  const filterByParams = route?.params?.filterName || TransactionFilter.ALL_TRANSACTIONS;
  const { getTestIdProps } = useTestingHelper('transaction-filters');
  const [currentFilter, setCurrentFilter] = useState<TransactionFilter>(filterByParams);
  const [shownFilter, setShownFilter] = useState<TransactionFilter>(filterByParams);
  const [activityList, setActivityList] = useState<(IActivity & { uuid: string })[]>([]);
  const [prevLastTimestamp, setPrevLastTimestamp] = useState<DateLike>(null);

  const scrollRef = useRef(null);

  const [fetchActivityList, isLoadingActivities = true, activitiesError, fetchedList = []] = useGetActivity();
  const debouncedIsLoadingActivities = useDebounce(isLoadingActivities, 50);

  const isListEmpty: boolean = useMemo(() => {
    return !debouncedIsLoadingActivities && !isLoadingActivities && !activityList.length;
  }, [activityList, isLoadingActivities, debouncedIsLoadingActivities]);

  const selectedItemMenuPosition = useMemo(() => transactionFilterMenuItems.findIndex(({ filter }) => filter === currentFilter), [currentFilter]);

  const isActive = useCallback(
    (filter: TransactionFilter) => {
      return filter === currentFilter;
    },
    [currentFilter]
  );

  const applyFilter = useCallback(
    (activity: IActivity) => {
      switch (currentFilter) {
        case TransactionFilter.LOCAL_OFFERS:
          return activity?.offers?.find(({ programType }) => programType === ProgramType.CARDLINK);
        case TransactionFilter.MISSIONS:
          return activity?.offers?.find(({ isStreak }) => isStreak);
        case TransactionFilter.REWARDS:
          return isGiftCard(activity);
        case TransactionFilter.SYW_MASTERCARD:
          return activity?.offers?.find(({ pointsType, programType }) => pointsType === PointsType.EARN && programType === ProgramType.CITI);
        default:
          return true;
      }
    },
    [currentFilter]
  );

  useEffect(() => {
    const newBatch = fetchedList
      .sort(sortByDate('timestamp'))
      .filter(activity => !prevLastTimestamp || activity.timestamp < prevLastTimestamp)
      .filter(applyFilter)
      .reverse()
      .map((a, i) => ({ ...a, uuid: `${Date.now()}-${i}}` }))
      .map(activity => {
        if (currentFilter !== TransactionFilter.REWARDS) return activity;
        if (!activity.offers?.length) return activity;
        return {
          ...activity,
          offers: activity.offers.filter(offer => offer.pointsType === PointsType.REDEEM)
        };
      });
    if (newBatch.length) {
      setActivityList(prev => [...prev, ...newBatch]);
    }
  }, [applyFilter, currentFilter, fetchedList, prevLastTimestamp]);

  useEffect(() => {
    setActivityList([]);
    fetchActivityList(Date.now()).then(activities => {
      const lastTimestamp = activities[0]?.timestamp;
      setPrevLastTimestamp(lastTimestamp);
    });
    setShownFilter(currentFilter);
  }, [currentFilter, fetchActivityList]);

  useEffect(() => {
    scrollRef?.current?.scrollTo({ x: MINIMUM_ITEM_SIZE * selectedItemMenuPosition });
  }, [selectedItemMenuPosition]);

  const getActivities = () => {
    const handleLoadMore = async () => {
      /* istanbul ignore next line - Can't be tested as container won't render until first search concludes */
      if (!prevLastTimestamp) return;
      const activities = await fetchActivityList(prevLastTimestamp);
      const lastTimestamp = activities[0]?.timestamp;
      setPrevLastTimestamp(lastTimestamp);
    };

    const activityListFilters = (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} ref={scrollRef} style={styles.filtersMargin}>
        {transactionFilterMenuItems.map(({ filter, title }, index) => {
          const isFilterActive = isActive(filter);
          return (
            <TouchableOpacity
              onPress={() => {
                setCurrentFilter(filter);
                setPrevLastTimestamp(null);
              }}
              {...getTestIdProps('menu-item')}
              key={index}
            >
              <Pill
                disableIcon={!index}
                iconContainerStyle={isFilterActive && styles.pillActivated}
                icon={<Icon name={ICON.SYW_CIRCLE} size={FONT_SIZE.SMALLER} color={isFilterActive ? COLOR.WHITE : COLOR.PRIMARY_BLUE} />}
                style={[!index && styles.allOffers, styles.pillContainer, isFilterActive && styles.pillActivated]}
              >
                <Text style={[styles.textPill, isFilterActive && styles.textPillActivated]}>{title}</Text>
              </Pill>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );

    return (
      <ActivityList
        showTransactionFallback
        transactionType={shownFilter}
        activityList={activityList}
        activitiesError={activitiesError}
        onLoadMore={handleLoadMore}
        isListEmpty={isListEmpty}
        isLoadingActivities={isLoadingActivities}
        ListHeaderComponent={activityListFilters}
      />
    );
  };

  if (activitiesError) {
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

  return (
    <View style={styles.container} {...getTestIdProps('container')}>
      {getActivities()}
    </View>
  );
};

export default TransactionFilters;
