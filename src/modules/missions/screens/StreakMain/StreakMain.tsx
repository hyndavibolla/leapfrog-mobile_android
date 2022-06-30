import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, View, TouchableOpacity, TextInput, Animated, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/core';
import moment from 'moment';

import CriticalErrorSvg from '_assets/shared/criticalError.svg';
import ShortArrowRight from '_assets/button/shortArrowRight.svg';
import StreakEmptyIcon from '_assets/shared/noMissionsFallback.svg';

import { Button } from '_components/Button';
import { ConfirmedPurchaseCard } from '_components/ConfirmedPurchaseCard';
import { CreditCard } from '_components/CreditCard';
import { EmptyState } from '_components/EmptyState';
import { Flagged } from '_components/Flagged';
import { MediumMissionCard } from '_modules/missions/components/MediumMissionCard';
import { MissionImpressionView } from '_modules/missions/components/MissionImpressionView';
import { MissionSearchInput } from '_modules/missions/components/MissionSearchInput';
import { LargeStreakCard } from '_components/LargeStreakCard';
import { Text } from '_components/Text';
import { Title, TitleType } from '_components/Title';
import { OnboardingTooltip } from '_components/OnboardingTooltip';
import { Carrousel } from '_components/Carrousel';
import { TranslateSearchBarWrapper } from '_commons/components/organisms/TranslateSearchBarWrapper';

import { COLOR, ENV, FONT_SIZE, ForterActionType, GROCERY_AND_DELIVERY_CATEGORY, ICON, ROUTES, TealiumEventType } from '_constants';
import { MissionModel } from '_models';
import { IActivity } from '_models/activity';
import { FeatureFlag, ButtonCreativeType, TooltipKey } from '_models/general';
import { MissionListType } from '_models/mission';

import { GlobalContext } from '_state_mgmt/GlobalState';
import { useEventTracker, useTooltipList } from '_state_mgmt/core/hooks';
import { useGetStreakActivitiesGroupedByDate } from '_state_mgmt/game/hooks';
import { useMissionFreeSearch } from '_state_mgmt/mission/hooks';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { useGetStreakList } from '_state_mgmt/streak/hooks';

import { createUUID } from '_utils/create-uuid';
import { splitArrayInChunks } from '_utils/splitArrayInChunks';
import { useDebounce } from '_utils/useDebounce';
import { useTestingHelper } from '_utils/useTestingHelper';
import { useViewableViewList } from '_utils/useViewableViewList';
import { useAnimatedHeader } from '_utils/useAnimatedHeader';
import { Icon } from '_commons/components/atoms/Icon';

import StreakMainSkeleton from './StreakMain.skeleton';
import { styles } from './styles';

export interface Props {
  navigation: StackNavigationProp<any>;
}

const StreakSywMax = 'SYWMAX-Streak';

export const StreakMain = ({ navigation }: Props) => {
  const { getTestIdProps } = useTestingHelper('streak-main');
  const { trackUserEvent } = useEventTracker();
  const { state, deps } = useContext(GlobalContext);
  const { getViewedTooltipList, getDismissedTooltipList } = useTooltipList();
  const [focusKey, setFocusKey] = useState<string>(null); /* a focus key is needed to prevent focus effect triggering before context's routes state is set */
  const nonRefreshRoutes = [
    ROUTES.MAIN_TAB.STREAK,
    ROUTES.MISSION_SEE_ALL,
    ROUTES.STREAK_LIST,
    ROUTES.TOOLTIP.MISSIONS
  ]; /* routes from where content shouldn't be reloaded */
  const shouldRefreshContent = !nonRefreshRoutes.includes(state.core.routeHistory[1]) && state.core.routeHistory[2] !== ROUTES.MISSION_DETAIL;
  const { viewedTooltipList, dismissedTooltipList } = state.core;
  const { userHasSywCard } = state.game.current.memberships;
  const [onGetViewedTooltipList] = getViewedTooltipList;
  const [onGetDismissedTooltipList] = getDismissedTooltipList;
  const [onGetStreakList, isLoadingStreakList = true, streakListError, streakList = []] = useGetStreakList();
  const [onMissionSearch, isLoadingMissionList, missionListError] = useMissionFreeSearch();
  const [onGetActivityMap, isLoadingActivityMap = true, activityMapError, activityMap = {}] = useGetStreakActivitiesGroupedByDate();
  const isComplete = streakList[0]?.currentQualifiedValue >= streakList[0]?.thresholdValue;
  const missionListKey = `streak-main-mission-list-${StreakSywMax}`;
  const isTooltipViewed = viewedTooltipList.includes(TooltipKey.MISSIONS);
  const mainScrollViewRef = useRef<ScrollView>(null);

  const missionListList = useMemo(
    () => splitArrayInChunks((state.mission.missionSearchMap[missionListKey] || []).map(uuid => state.mission.missionMap[uuid]).filter(Boolean), 2),
    [missionListKey, state.mission]
  );

  const isLoading = useDebounce(
    isLoadingStreakList || isLoadingMissionList || (isLoadingActivityMap && !streakListError && streakList.length > 0),
    ENV.IMAGE_LOADING_FLICKERING_DEBOUNCE_MS
  );

  const [viewedMissionList, checkAllViewableMissions, containerRef, setMissionItemRef] = useViewableViewList(
    ENV.MISSION_TRACKING.TIME_THRESHOLD,
    ENV.MISSION_TRACKING.VISIBILITY_THRESHOLD,
    navigation.isFocused() && !isLoadingMissionList
  );

  const searchInputRef = useRef<TextInput>();

  const { scrollYValue, searchBarTranslate } = useAnimatedHeader();

  const onScrollEnd = useCallback(() => {
    checkAllViewableMissions();
  }, [checkAllViewableMissions]);

  const getMissionItemUuid = useCallback((mission: MissionModel.IMission, prefix: string) => `${prefix};${mission.uuid}`, []);
  const onMissionPress = useCallback(
    (mission: MissionModel.IMission, isAvailableStreakIndicator: boolean) =>
      navigation.navigate(ROUTES.MISSION_DETAIL, { brandRequestorId: mission.brandRequestorId, isAvailableStreakIndicator }),
    [navigation]
  );
  const keyExtractor = useCallback((item: MissionModel.IMission[]) => item.map(i => i.uuid).join('&'), []);
  const renderItem = useCallback(
    ({ item: missionList }: { item: MissionModel.IMission[] }) => (
      <View style={styles.columnContainer}>
        {missionList.map(mission => (
          <View
            key={mission.uuid}
            style={styles.columnItemContainer}
            collapsable={false}
            ref={itemRef => setMissionItemRef(getMissionItemUuid(mission, 'special'), itemRef)}
          >
            <MissionImpressionView
              streakIndicator={true}
              missionCardComponent={MediumMissionCard}
              mission={mission}
              onPress={onMissionPress}
              wasViewed={viewedMissionList.includes(getMissionItemUuid(mission, 'special'))}
              creativeType={ButtonCreativeType.GRID}
            />
          </View>
        ))}
      </View>
    ),
    [viewedMissionList, setMissionItemRef, getMissionItemUuid, onMissionPress]
  );

  useEffect(() => {
    onGetViewedTooltipList();
    if (!dismissedTooltipList.includes(TooltipKey.MISSIONS)) onGetDismissedTooltipList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onMissionSearch(missionListKey, MissionListType.DEFAULT, undefined, undefined, ENV.MISSION_LIMIT.STREAK, 0, undefined, undefined, StreakSywMax);
  }, [missionListKey, onMissionSearch]);

  useEffect(() => {
    if (streakList.length) {
      const { startDt, rewardOfferCode } = streakList[0];
      onGetActivityMap(startDt, rewardOfferCode);
    }
  }, [onGetActivityMap, streakList]);

  useEffect(() => {
    if (!focusKey || !shouldRefreshContent) return;
    onGetStreakList(true);
  }, [focusKey, shouldRefreshContent, onGetStreakList]);

  useFocusEffect(
    useCallback(() => {
      setFocusKey(createUUID());
      mainScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: false });
    }, [])
  );

  const onActiveMissionsNavigation = useCallback(() => {
    navigation.navigate(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      missionListType: MissionListType.DYNAMIC_LIST_2,
      title: state.mission.missionListTitleMap[KnownMissionSearchKey.DYNAMIC_LIST_2]
    });
    searchInputRef.current.blur();
  }, [navigation, state.mission.missionListTitleMap]);

  const onGroceryAndDeliveryNavigation = useCallback(() => {
    navigation.navigate(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.GENERAL_SEARCH_RESULTS,
      missionListType: MissionListType.DEFAULT,
      initialSearchCriteria: { categoryNameList: [GROCERY_AND_DELIVERY_CATEGORY] }
    });
  }, [navigation]);

  const onSeeTooltipScreen = () => {
    trackUserEvent(TealiumEventType.MISSIONS_TOOLTIP, {}, ForterActionType.TAP);
    navigation.navigate(ROUTES.TOOLTIP.MISSIONS);
  };

  const onApplyingForCardPress = useCallback(() => {
    trackUserEvent(TealiumEventType.CARD_APPLICATION, { event_type: TealiumEventType.INITIATE_MISSIONS }, ForterActionType.TAP);
    navigation.navigate(ROUTES.MAIN_TAB.WALLET);
  }, [navigation, trackUserEvent]);

  const renderSkeletonOrErrorMessage = useMemo(() => {
    if (isLoading) return <StreakMainSkeleton />;
    if (streakListError || !streakList.length)
      return (
        <View style={styles.fallbackContainer} {...getTestIdProps('streaks-error')}>
          <EmptyState
            visible={true}
            Icon={StreakEmptyIcon}
            title="Whoops! No Missions around here"
            subtitleLine1="Please try again in a few minutes."
            subtitleLine2="In the meantime, explore all the ways to earn points everyday in the 🚀 Earn section!"
          />
        </View>
      );
  }, [getTestIdProps, isLoading, streakList.length, streakListError]);

  return (
    <View style={styles.container} {...getTestIdProps('container')} ref={containerRef}>
      <Animated.View>
        <TranslateSearchBarWrapper translateY={searchBarTranslate}>
          <Flagged feature={FeatureFlag.MISSIONS_SEARCH}>
            <MissionSearchInput hideFilters ref={searchInputRef} onFocusChange={onActiveMissionsNavigation} placeholder={'Search for Missions'} />
          </Flagged>
        </TranslateSearchBarWrapper>
        {renderSkeletonOrErrorMessage || (
          <Animated.ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYValue } } }], { useNativeDriver: true })}
            contentInsetAdjustmentBehavior="automatic"
            ref={mainScrollViewRef}
          >
            <OnboardingTooltip
              title={isComplete ? 'Mission Complete' : 'MAX Missions'}
              subtitle={streakList[0]?.disclaimer}
              onPress={onSeeTooltipScreen}
              isFlashy={!isTooltipViewed}
            />

            <View style={styles.listContainer}>
              {streakList.slice(0, 1).map(streak => (
                <LargeStreakCard key={streak.rewardOfferCode} streak={streak} />
              ))}
            </View>

            {activityMapError ? (
              <View style={styles.cpErrorContainer} {...getTestIdProps('activities-error')}>
                <CriticalErrorSvg width={80} height={80} />
                <View style={styles.cpErrorTitles}>
                  <Text style={styles.cpErrorTitle}>We couldn't load your transactions</Text>
                  <Text>Please try again in a few minutes.</Text>
                </View>
              </View>
            ) : (
              streakList
                .slice(0, 1)
                /** grouping activities by date by streak */
                .map(streak => ({
                  streak,
                  list: Object.entries(activityMap)
                    .sort(([dateA], [dateB]) => moment(dateB).diff(dateA))
                    .reduce<{ activityTupleList: [string, IActivity[]][]; currentItems: number }>(
                      ({ activityTupleList, currentItems }, [date, activityList]) => {
                        if (currentItems >= streak.thresholdValue) return { activityTupleList: [...activityTupleList, [date, []]], currentItems };
                        const sortedActivityList = [...(activityList as IActivity[])].sort((actA, actB) => moment(actB.timestamp).diff(actA.timestamp));
                        if (sortedActivityList.length + currentItems > streak.thresholdValue) {
                          return {
                            activityTupleList: [...activityTupleList, [date, sortedActivityList.slice(0, streak.thresholdValue - currentItems)]],
                            currentItems: streak.thresholdValue
                          };
                        }
                        return { activityTupleList: [...activityTupleList, [date, sortedActivityList]], currentItems: sortedActivityList.length };
                      },
                      { activityTupleList: [] as [string, IActivity[]][], currentItems: 0 }
                    )
                    .activityTupleList.filter(([, activityList]) => activityList.length)
                }))
                /** filtering out streak without activities */
                .filter(({ list }) => list.length)
                .map(({ streak, list }) => (
                  <View style={styles.cp} key={streak.rewardOfferCode}>
                    <View style={styles.cpTitle}>
                      <Title type={TitleType.SECTION}>Confirmed Purchases</Title>
                      <Text style={styles.cpProgressText}>
                        {streak.currentQualifiedValue <= streak.thresholdValue ? streak.currentQualifiedValue : streak.thresholdValue}/{streak.thresholdValue}
                      </Text>
                    </View>
                    {list.map(([date, activityList]) => (
                      <View key={date}>
                        <Text style={styles.cpMonth}>{moment(date).format('MMMM')}</Text>
                        {activityList.map((activity, index) => (
                          <ConfirmedPurchaseCard key={index} activity={activity} />
                        ))}
                      </View>
                    ))}
                    <Button
                      onPress={() => navigation.navigate(ROUTES.POINT_HISTORY)}
                      innerContainerStyle={styles.goToPurchasesBtn}
                      textStyle={styles.goToPurchasesTextBtn}
                      textColor={COLOR.BLACK}
                      containerColor={COLOR.GRAY}
                      {...getTestIdProps('go-to-purchases-btn')}
                    >
                      {['Go to Purchases', () => <ShortArrowRight width={12} height={12} />]}
                    </Button>
                  </View>
                ))
            )}

            <View style={styles.creditCardContainer}>
              <CreditCard userHasSywCard={userHasSywCard} onPress={onApplyingForCardPress} />
            </View>

            {moment(streakList[0].endDt).isSameOrBefore(Date.now()) ? null : (
              <View {...getTestIdProps('missions')}>
                <View style={styles.listTitleContainer}>
                  <Title type={TitleType.SECTION}>Get Started!</Title>
                  {missionListError || !missionListList?.length ? null : (
                    <TouchableOpacity onPress={onGroceryAndDeliveryNavigation} {...getTestIdProps('missions-grocery-and-delivery')}>
                      <Title type={TitleType.SECTION} style={styles.searchTitle}>
                        See all
                      </Title>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.listContainer}>
                  {missionListError || missionListList.length < 1 ? (
                    <View style={styles.missionErrorContainer} {...getTestIdProps('missions-error')}>
                      <Icon
                        name={ICON.CUSTOM_MISSION}
                        size={FONT_SIZE.BIGGER}
                        color={COLOR.RED}
                        backgroundStyle={styles.iconBackground}
                        innerBackgroundStyle={styles.iconInnerBackground}
                      />
                      <Text style={styles.missionErrorTitle}>Whoops! No Missions around here</Text>
                      <Text style={styles.missionErrorSubtitle}>Please try again in a few minutes.</Text>
                      <Text style={styles.missionErrorSubtitle}>
                        In the meantime, explore Mission eligible brands
                        <Icon name={ICON.MISSION} size={FONT_SIZE.MEDIUM} /> in the Earn section!
                      </Text>
                    </View>
                  ) : (
                    <Carrousel itemWidth={170} separatorWidth={20}>
                      <FlatList
                        style={styles.list}
                        contentContainerStyle={styles.missionListContainer}
                        data={missionListList}
                        horizontal={true}
                        removeClippedSubviews={true}
                        initialNumToRender={4}
                        updateCellsBatchingPeriod={150}
                        maxToRenderPerBatch={6}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        onMomentumScrollEnd={onScrollEnd}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                        onScrollEndDrag={deps.nativeHelperService.platform.select({ ios: onScrollEnd, default: onScrollEnd })}
                        scrollEventThrottle={10}
                        {...getTestIdProps('horizontal-scroll')}
                      />
                    </Carrousel>
                  )}
                </View>
              </View>
            )}
          </Animated.ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

export default memo(StreakMain);
/* istanbul ignore next line - ignoring this one for now */
export const ItemSeparatorComponent = memo(() => <View style={styles.itemSeparator} />);
