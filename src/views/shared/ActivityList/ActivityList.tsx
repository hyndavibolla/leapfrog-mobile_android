/** @todo istanbul ignore was added because ActivityList does not have tests */
/* istanbul ignore file */

import React, { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import moment from 'moment';

import CircleCartErrorIcon from '_assets/shared/circleCartError.svg';
import SwyEmptyBalance from '_assets/shared/swyEmptyBalance.svg';
import { ActivityModel, OfferModel } from '_models';
import { TransactionFilter } from '_models/offer';
import { useTestingHelper } from '_utils/useTestingHelper';
import { ActivityDetail } from '_views/PointBalanceDetail/components/ActivityDetail';
import { OfferItem } from '_views/PointBalanceDetail/components/OfferItem';
import { FallbackTransactions } from '_views/TransactionFilters/components';
import ErrorBoundary from '../ErrorBoundary';
import { Modal, ModalSize } from '../Modal';
import { Spinner } from '../Spinner';
import { Text } from '../Text';
import { styles } from './styles';

export interface Props {
  activityList: (ActivityModel.IActivity & { uuid: string })[];
  activitiesError: any;
  onLoadMore: () => void;
  isListEmpty: boolean;
  isLoadingActivities: boolean;
  showTransactionFallback?: boolean;
  ListHeaderComponent?: any;
  transactionType?: TransactionFilter;
}

let itemNullCounter: number = 0;

export const ActivityList = ({
  activityList,
  activitiesError,
  onLoadMore,
  isListEmpty,
  isLoadingActivities,
  showTransactionFallback,
  ListHeaderComponent,
  transactionType = TransactionFilter.ALL_TRANSACTIONS
}: Props) => {
  const { getTestIdProps } = useTestingHelper('activity-history');
  const [selectedKeyPair, setSelectedKeyPair] = useState<[ActivityModel.IActivity, OfferModel.IOffer]>([null, null]);
  const [selectedActivity, selectedOffer] = selectedKeyPair;
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(false);
  const closeDetailModal = useCallback(() => setSelectedKeyPair([null, null]), [setSelectedKeyPair]);

  const keyExtractor = useCallback((activity: ActivityModel.IActivity & { uuid: string }) => activity.uuid, []);

  const indexFirstInvalidTimePeriod = activityList.findIndex(({ timestamp }) => timestamp === null);

  const renderItem = useCallback(
    ({ item: activity, index }: { item: ActivityModel.IActivity; index: number }) => {
      const prevItem = activityList[index - (1 + itemNullCounter)];

      const shouldShowSeparator =
        (moment(activity?.timestamp).isValid() || index === indexFirstInvalidTimePeriod) &&
        (!prevItem || !moment(activity?.timestamp).isSame(prevItem?.timestamp, 'month'));

      if (activity.activityType === ActivityModel.Type.AVAILABLE) {
        itemNullCounter++;
        return null;
      }
      itemNullCounter = 0;
      return (
        <OfferItem
          shouldShowSeparator={shouldShowSeparator}
          activity={activity}
          onPress={setSelectedKeyPair}
          titleStyle={!!index && styles.firstSeparatorLabel}
        />
      );
    },
    [activityList, indexFirstInvalidTimePeriod]
  );

  const ListFooterComponent = useMemo(
    () =>
      !isLoadingActivities ? null : (
        <View {...getTestIdProps('loading')} style={styles.spinnerContainer}>
          <Spinner size={40} />
          <Text style={styles.spinnerText}>{activityList?.length ? 'Loading your transactions...' : 'Searching transactions...'}</Text>
        </View>
      ),
    [isLoadingActivities, activityList, getTestIdProps]
  );

  const ListEmptyComponent = useMemo(() => {
    if (!isLoadingActivities && activitiesError) {
      return (
        <View style={styles.emptyStateContainer} {...getTestIdProps('activities-error')}>
          <CircleCartErrorIcon width={80} height={80} />
          <Text style={styles.emptyStateTitle}>We couldn't load your transactions</Text>
          <Text style={styles.emptyStateSubtitle}>
            Sorry, something went wrong.{'\n'}We're working to find a solution.{'\n'}Come back later!
          </Text>
        </View>
      );
    }
    if (isListEmpty) {
      if (showTransactionFallback) {
        return <FallbackTransactions transactionType={transactionType} style={styles.fallbackTransaction} />;
      }
      return (
        <View style={styles.emptyStateContainer} {...getTestIdProps('empty-state')}>
          <SwyEmptyBalance />
          <Text style={styles.emptyStateTitle}>You don’t have recent transactions</Text>
          <Text style={styles.emptyStateSubtitle}>
            When you earn points{'\n'}you’ll see your transactions here.{'\n'}Start earning!
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingActivities, activitiesError, isListEmpty, showTransactionFallback, getTestIdProps, transactionType]);

  const onMomentumScrollBegin = () => {
    setOnEndReachedCalledDuringMomentum(false);
  };

  const onEndReached = () => {
    if (!onEndReachedCalledDuringMomentum) {
      onLoadMore();
      setOnEndReachedCalledDuringMomentum(true);
    }
  };

  return (
    <>
      <ErrorBoundary>
        <FlatList
          {...getTestIdProps('list')}
          contentContainerStyle={styles.container}
          extraData={activityList}
          data={activityList}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onEndReached={onEndReached}
          refreshing={isLoadingActivities}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </ErrorBoundary>
      <Modal visible={!!selectedActivity} onClose={closeDetailModal} size={ModalSize.EXTRA_LARGE}>
        <ActivityDetail activity={selectedActivity} offer={selectedOffer} />
      </Modal>
    </>
  );
};

export default memo(ActivityList);
