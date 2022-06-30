import React, { memo, useContext, useMemo, useCallback, useState, useEffect, useRef, Fragment, useLayoutEffect } from 'react';
import { View, ScrollView, useWindowDimensions, TextInput, Animated, LayoutChangeEvent } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import moment from 'moment';

import { MissionSearchInput } from '_modules/missions/components/MissionSearchInput';
import { CriticalError } from '_components/CriticalError';
import { EmptyState } from '_components/EmptyState';
import { ConditionalWrapper } from '_commons/components/molecules/ConditionalWrapper';
import { EarnMainSkeleton } from '_modules/earn/components/EarnMainSkeleton';
import { NewOnMax } from '_modules/earn/components/NewOnMax';
import { ClaimYourRewards } from '_modules/earn/components/ClaimYourRewards';
import { FeaturedMissions } from '_modules/earn/components/FeaturedMissions';
import { Surveys } from '_modules/earn/components/Surveys';
import { EarnList } from '_modules/earn/components/EarnList';
import { TopCategories } from '_modules/earn/components/TopCategories';
import { FindOffersMap } from '_modules/earn/components/FindOffersMap';
import { TopBrands } from '_modules/earn/components/TopBrands';
import { RecentlyViewedMissions } from '_modules/missions/components/RecentlyViewedMissions';
import { CPAMissionCard } from '_modules/missions/components/CPAMissionCard';
import ErrorBoundary from '_components/ErrorBoundary';
import { WelcomeTutorialBanner } from '_modules/earn/components/WelcomeTutorialBanner';
import { TutorialReminderModal } from '_modules/earn/components/TutorialReminderModal';
import { TutorialCongratsBanner } from '_modules/earn/components/TutorialCongratsBanner';
import { ActiveMissionsOffers } from '_components/ActiveMissionsOffers';
import { Tutorial } from '_commons/components/organisms/Tutorial';
import { ViewWithTutorial } from '_commons/components/organisms/ViewWithTutorial';

import { useTestingHelper } from '_utils/useTestingHelper';
import { useViewableViewList } from '_utils/useViewableViewList';
import { createUUID } from '_utils/create-uuid';
import { useDebounce } from '_utils/useDebounce';
import { useEarnSections } from '_utils/useEarnSections';
import { useControlTutorial } from '_commons/hooks/useControlTutorial';
import { useLocationPermission } from '_utils/useLocationPermission';
import { TranslateSearchBarWrapper } from '_commons/components/organisms/TranslateSearchBarWrapper';
import { useUpdateRecentlyViewedMissions } from '_state_mgmt/mission/hooks';

import { MissionModel } from '_models';
import { MissionListType } from '_models/mission';
import { DateLike, ITutorialStatus, RemoteConfigModel } from '_models/general';

import { ROUTES, ENV, TealiumEventType, UxObject, ForterActionType, PageNames, EventDetail } from '_constants';
import { EarnSections } from './constants';
import { GlobalContext } from '_state_mgmt/GlobalState';
import { useGetKnownMissionGroup, useGetMissionCategoryList, useMissionFreeSearch } from '_state_mgmt/mission/hooks';
import { KnownMissionSearchKey } from '_state_mgmt/mission/state';
import { useEventTracker, usePNPrompt } from '_state_mgmt/core/hooks';
import { actions } from '_state_mgmt/core/actions';

import RewardsEmptyState from '_assets/shared/rewardsEmptyState.svg';
import Congrats from '_assets/tutorial/congrats.json';
import { useAnimatedHeader } from '_utils/useAnimatedHeader';

import { styles } from './styles';

const defaultSections = { mapCardSection: { loaded: false, y: 0 } };

export type Section = keyof typeof defaultSections;

export interface Props {
  navigation: StackNavigationProp<any>;
  route: { params?: { scrollToSection?: Section; isShowTutorial?: boolean } };
}

const aspectRatioSixthItem = 660 / 290; // Original width and Original height from Banner Image

const tutorials = {
  [EarnSections.NEW_ON_MAX]: { step: 1 },
  [EarnSections.ACTIVE_MISSION_OFFERS]: { step: 2 },
  [EarnSections.MAP_CARD]: { step: 3 },
  [EarnSections.CLAIM_YOUR_REWARDS]: { step: 4, moveDown: 100 }
};

export const EarnMain = ({ navigation, route }: Props) => {
  const { getTestIdProps } = useTestingHelper('earn-main');
  const {
    state: {
      mission,
      core: { routeHistory, isTutorialVisible, isTutorialAvailable, tutorialFrom },
      game: {
        current: {
          balance: { availablePoints }
        }
      },
      cardLink: { isLocalOfferFailed, hasCalledLocalOffer },
      mission: { recentlyViewedMissions }
    },
    deps,
    dispatch
  } = useContext(GlobalContext);
  const [focusKey, setFocusKey] = useState<string>(null); /** a focus key is needed to prevent focus effect triggering before context's routes state is set */
  const [sections, setSections] = useState(defaultSections);
  const { missionSearchMap, missionMap, categoryList } = mission;
  const { isLocationAvailable } = useLocationPermission();
  const { topHeight, setTopHeight, parentTutorialItems, tutorialItems, updateTutorialItems } = useControlTutorial();
  const [onLoadKnownMissionGroups, isLoadingMissions = true, error] = useGetKnownMissionGroup();
  const [onLoadMissionCategoryList, isLoadingMissionCategoryList = true, missionCategoryListError] = useGetMissionCategoryList();
  const [updateRecentlyViewedMissions] = useUpdateRecentlyViewedMissions();
  const { width, height, scale } = useWindowDimensions();
  const { trackUserEvent } = useEventTracker();
  const [onLoadEarnSections, isLoadingSections = true, sectionsError, visibleSections = []] = useEarnSections();
  const [onPNPrompt] = usePNPrompt();
  const [isLoadingStreakList, setIsLoadingStreakList] = useState(true);
  const isLoading = isLoadingMissions || isLoadingStreakList || isLoadingMissionCategoryList || isLoadingSections;
  const [onMissionFreeSearch] = useMissionFreeSearch();
  const onGetExceptionalOfferList = useCallback(
    () => onMissionFreeSearch(KnownMissionSearchKey.EXCEPTIONAL, MissionListType.EXCEPTIONAL),
    [onMissionFreeSearch]
  );
  const categoryListTopAndSorted = useMemo(() => [...categoryList].sort((a, b) => a.rank - b.rank).slice(0, 6), [categoryList]);
  const searchInputRef = useRef<TextInput>();
  const [isBannerWatched, setIsBannerWatched] = useState<boolean>(false);
  const [showCongratsAnimation, setShowCongratsAnimation] = useState<boolean>(false);
  const [showTutorialBanner, setShowTutorialBanner] = useState<boolean>(false);
  const [fromSkipTutorial, setFromSkipTutorial] = useState<boolean>(false);
  const [recentlyViewedMissionsIds, setRecentlyViewedMissionsIds] = useState<string[]>([]);

  const prevRoute = routeHistory[1];
  const shouldRefreshContent = routeHistory.length <= 2 /** current plus prev routes */ || ![ROUTES.MISSION_DETAIL].includes(prevRoute);

  const [viewedMissionList, checkAllViewableMissions, containerRef, setMissionItemRef] = useViewableViewList(
    ENV.MISSION_TRACKING.TIME_THRESHOLD,
    ENV.MISSION_TRACKING.VISIBILITY_THRESHOLD,
    navigation.isFocused() && !isLoading
  );

  const [secondMissionList, thirdMissionList, fourthMissionList, sixthMissionList] = useMemo(
    () =>
      [
        KnownMissionSearchKey.DYNAMIC_LIST_2,
        KnownMissionSearchKey.DYNAMIC_LIST_3,
        KnownMissionSearchKey.DYNAMIC_LIST_4,
        KnownMissionSearchKey.DYNAMIC_LIST_6
      ].map(key =>
        missionSearchMap[key]
          .map(uuid => missionMap[uuid])
          .filter(Boolean)
          .slice(0, ENV.MISSION_LIMIT.KEEP_EARNING /** using this limit arbitrarily */)
      ),
    [missionMap, missionSearchMap]
  );

  const filteredSixthMissionList = useMemo(
    () => sixthMissionList.filter(sixMissionListItem => sixMissionListItem.image && sixMissionListItem.callToActionUrl),
    [sixthMissionList]
  );

  /** check if points, missions offers and local offers are available to show tutorial */
  useLayoutEffect(() => {
    let tutorialAvailable = false;
    const isPointsAndOffersAvailable = secondMissionList?.length > 0 && availablePoints !== null && availablePoints !== undefined;

    if (isLocationAvailable) {
      tutorialAvailable = isPointsAndOffersAvailable && !isLocalOfferFailed && hasCalledLocalOffer;
    } else {
      tutorialAvailable = isPointsAndOffersAvailable;
    }

    dispatch(actions.setTutorialAvailable(tutorialAvailable));
  }, [availablePoints, dispatch, hasCalledLocalOffer, isLocalOfferFailed, isLocationAvailable, secondMissionList]);

  const missionsTotalCount = fourthMissionList.length + thirdMissionList.length;
  const hideContent = !missionsTotalCount && isLoading;
  /** meant to avoid the scroll from resetting when reloading offers on the background */
  const debouncedHideContent = useDebounce(hideContent, 0);

  const { scrollYValue, searchBarTranslate } = useAnimatedHeader();

  const onScrollEnd = useCallback(() => {
    checkAllViewableMissions();
  }, [checkAllViewableMissions]);

  /* istanbul ignore next line */
  const onScrollBeginDrag = useCallback(() => {
    if (searchInputRef?.current?.isFocused()) searchInputRef?.current?.blur();
  }, []);

  const getNavigateToDetail = useCallback(
    (missionToNavigate: MissionModel.IMission, isAvailableStreakIndicator: boolean) => {
      trackUserEvent(
        TealiumEventType.SELECT_MISSION,
        {
          page_name: PageNames.MAIN.EARN,
          event_type: missionToNavigate.brandName,
          event_detail: missionToNavigate.offerId,
          uxObject: UxObject.LIST,
          brand_name: missionToNavigate.brandName,
          brand_id: missionToNavigate.brandRequestorId,
          brand_category: missionToNavigate.brandCategories[0]
        },
        ForterActionType.TAP
      );
      navigation.navigate(ROUTES.MISSION_DETAIL, { brandRequestorId: missionToNavigate.brandRequestorId, isAvailableStreakIndicator });
    },
    [trackUserEvent] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const trackBannerShown = useCallback(() => {
    trackUserEvent(
      TealiumEventType.TUTORIAL,
      {
        page_name: PageNames.MAIN.EARN,
        event_name: TealiumEventType.TUTORIAL,
        uxObject: UxObject.TILE,
        event_type: TealiumEventType.TUTORIAL_BANNER_SHOWN
      },
      ForterActionType.TAP
    );
  }, [trackUserEvent]);

  useFocusEffect(
    useCallback(() => {
      const getTutorialStatus = async () => {
        const tutorialStatus = await deps.nativeHelperService.storage.get<ITutorialStatus>(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS);

        if (tutorialStatus?.isBannerWatched) setIsBannerWatched(tutorialStatus.isBannerWatched);
        else trackBannerShown();
      };

      getTutorialStatus();
    }, [deps.nativeHelperService.storage, trackBannerShown])
  );

  const setBannerStatus = useCallback(
    async ({ watched, bannerDate }: { watched: boolean; bannerDate?: DateLike }) => {
      const newStatus = {
        isBannerWatched: watched,
        date: bannerDate
      };
      await deps.nativeHelperService.storage.set(ENV.STORAGE_KEY.TUTORIAL_SKIP_STATUS, newStatus);
    },
    [deps.nativeHelperService.storage]
  );

  const handleShowTutorial = useCallback(async () => {
    setBannerStatus({ watched: true });
    setIsBannerWatched(true);
    dispatch(actions.showTutorial(true));
  }, [dispatch, setBannerStatus]);

  useEffect(() => {
    const isShowTutorial = route.params?.isShowTutorial ?? false;
    if (isShowTutorial) handleShowTutorial();
  }, [handleShowTutorial, route.params?.isShowTutorial]);

  useFocusEffect(
    useCallback(() => {
      setFocusKey(createUUID());
      if (route?.params?.scrollToSection) {
        if (sections[route?.params?.scrollToSection].loaded) {
          earnMainScrollViewRef.current.scrollTo({ y: sections[route?.params?.scrollToSection].y, animated: true });
          route.params.scrollToSection = null;
        }
      }
    }, [route.params, sections])
  );

  useFocusEffect(
    useCallback(() => {
      if (route?.params?.scrollToSection === undefined) {
        earnMainScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
      return () => navigation.setParams({ isShowTutorial: undefined });
    }, [navigation, route?.params?.scrollToSection])
  );

  useEffect(() => {
    if (!focusKey || !shouldRefreshContent) return;

    onPNPrompt(true);
    onLoadMissionCategoryList();
    onLoadKnownMissionGroups();
    onGetExceptionalOfferList();
    onLoadEarnSections();
  }, [focusKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateRecentlyViewedMissions(recentlyViewedMissionsIds);
  }, [updateRecentlyViewedMissions, recentlyViewedMissionsIds]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setRecentlyViewedMissionsIds((await deps.nativeHelperService.storage.get<string[]>(ENV.STORAGE_KEY.RECENTLY_VIEWED_MISSIONS)) || []);
      })();
    }, [deps.nativeHelperService.storage])
  );

  const earnMainScrollViewRef = useRef<ScrollView>(null);

  const setSectionCoordinate = useCallback(
    (section: Section, event: LayoutChangeEvent) => {
      setSections({ ...sections, [section]: { loaded: true, y: event.nativeEvent.layout.y - 12 } });
    },
    [sections]
  );

  const onFocusChange = useCallback(async () => {
    navigation.navigate(ROUTES.MISSION_SEE_ALL, {
      searchKey: KnownMissionSearchKey.SEE_ALL,
      missionListType: MissionListType.DEFAULT,
      isMainSearchFromEarnPage: true
    });
    searchInputRef.current.blur();
  }, [navigation]);

  const handleNavigateToRecentlyViewedMission = useCallback(
    (missionToNavigate: MissionModel.IMission, isAvailableStreakIndicator: boolean) => {
      trackUserEvent(
        TealiumEventType.SELECT_MISSION,
        {
          page_name: PageNames.MAIN.EARN,
          event_type: missionToNavigate.brandName,
          event_detail: JSON.stringify({ from: EventDetail.RECENTLY_VIEWED_MISSIONS, brand_id: missionToNavigate.brandRequestorId }),
          event_name: TealiumEventType.SELECT_MISSION,
          uxObject: UxObject.LIST,
          brand_name: missionToNavigate.brandName,
          brand_id: missionToNavigate.brandRequestorId,
          brand_category: missionToNavigate.brandCategories[0]
        },
        ForterActionType.TAP
      );
      navigation.navigate(ROUTES.MISSION_DETAIL, { brandRequestorId: missionToNavigate.brandRequestorId, isAvailableStreakIndicator });
    },
    [navigation, trackUserEvent]
  );

  const handlePressCpaBanner = useCallback(
    cpaMission => {
      trackUserEvent(
        TealiumEventType.SELECT_MISSION,
        {
          uxObject: UxObject.TILE,
          event_type: 'cpa_banner',
          event_detail: JSON.stringify({ url: cpaMission.callToActionUrl })
        },
        null
      );

      navigation.navigate(ROUTES.COMMON_WEB_VIEW.MAIN, {
        title: cpaMission.brandName,
        url: cpaMission.callToActionUrl
      });
    },
    [navigation, trackUserEvent]
  );

  const handleOnSkipTutorialBanner = useCallback(
    (fromWelcomeBanner = false) => {
      setShowTutorialBanner(true);
      setFromSkipTutorial(true);
      setTimeout(() => {
        setShowTutorialBanner(false);
        setFromSkipTutorial(false);
        if (fromWelcomeBanner) {
          setBannerStatus({ watched: true, bannerDate: moment().toString() });
        }
      }, Number(ENV.TUTORIAL.HIDE_DELAY_MS));
    },
    [setBannerStatus]
  );

  const handleSkipTutorial = useCallback(async () => {
    setIsBannerWatched(true);
    trackUserEvent(
      TealiumEventType.TUTORIAL,
      {
        page_name: PageNames.MAIN.EARN,
        event_name: TealiumEventType.TUTORIAL,
        event_type: TealiumEventType.TUTORIAL_SKIPPED,
        event_detail: JSON.stringify({ skipped_on: 'tutorial_banner' }),
        uxObject: UxObject.BUTTON
      },
      ForterActionType.TAP
    );
    handleOnSkipTutorialBanner(true);
  }, [trackUserEvent, handleOnSkipTutorialBanner]);

  /** @todo istanbul ignore next added because of warnings on test */
  /* istanbul ignore next */
  const onTutorialEnd = useCallback(() => {
    earnMainScrollViewRef?.current?.scrollTo({ x: 0, y: 0, animated: true });
    dispatch(actions.showTutorial(false));
    trackUserEvent(
      TealiumEventType.TUTORIAL,
      {
        page_name: PageNames.MAIN.EARN,
        event_name: TealiumEventType.TUTORIAL,
        event_type: TealiumEventType.TUTORIAL_COMPLETED,
        event_detail: JSON.stringify({ from: tutorialFrom }),
        uxObject: UxObject.TILE
      },
      ForterActionType.TAP
    );
    setShowCongratsAnimation(true);
    setShowTutorialBanner(true);
    setTimeout(() => setShowCongratsAnimation(false), Number(ENV.TUTORIAL.CONGRATS_DELAY_MS));
    setTimeout(() => setShowTutorialBanner(false), Number(ENV.TUTORIAL.END_DELAY_MS));
    return;
  }, [dispatch, trackUserEvent, tutorialFrom]);

  const newOnMax = useCallback((props: RemoteConfigModel.IEarnSection) => <NewOnMax focusKey={focusKey} key={props.name} {...props} />, [focusKey]);
  const featuredPartners = useCallback(
    (props: RemoteConfigModel.IEarnSection) => (
      <EarnList
        data={filteredSixthMissionList}
        setMissionItemRef={setMissionItemRef}
        itemOnPress={handlePressCpaBanner}
        viewedMissionList={viewedMissionList}
        onScrollEnd={onScrollEnd}
        missionItemUuidPrefix="list-6"
        missionCardComponent={CPAMissionCard}
        listType={KnownMissionSearchKey.DYNAMIC_LIST_6}
        itemContainerStyle={{ width: width * 0.9, height: (width * 0.9) / aspectRatioSixthItem }}
        sectionHeaderTitle={mission.missionListTitleMap[KnownMissionSearchKey.DYNAMIC_LIST_6] ?? 'Featured Partners'}
        headerShouldShowSeeAll={false}
        showHeaderOnPress={false}
        itemWidth={width * 0.9}
        key={props.name}
        {...props}
      />
    ),
    [filteredSixthMissionList, handlePressCpaBanner, mission.missionListTitleMap, onScrollEnd, setMissionItemRef, viewedMissionList, width]
  );
  const activeMissionsOffers = useCallback(
    (props: RemoteConfigModel.IEarnSection) =>
      secondMissionList.length ? (
        <View key={props.name}>
          <ErrorBoundary>
            <View style={styles.activeMissionsOffersSection} {...getTestIdProps('streak-section')}>
              <ActiveMissionsOffers offers={secondMissionList} {...props} />
            </View>
          </ErrorBoundary>
        </View>
      ) : null,
    [getTestIdProps, secondMissionList]
  );
  const topCategories = useCallback(
    (props: RemoteConfigModel.IEarnSection) => <TopCategories data={categoryListTopAndSorted} key={props.name} {...props} />,
    [categoryListTopAndSorted]
  );
  const topBrands = useCallback(
    (props: RemoteConfigModel.IEarnSection) => (
      <TopBrands
        data={thirdMissionList}
        setMissionItemRef={setMissionItemRef}
        itemOnPress={getNavigateToDetail}
        viewedMissionList={viewedMissionList}
        onScrollEnd={onScrollEnd}
        missionItemUuidPrefix="list-3"
        listType={KnownMissionSearchKey.DYNAMIC_LIST_3}
        key={props.name}
        {...props}
      />
    ),
    [getNavigateToDetail, onScrollEnd, setMissionItemRef, thirdMissionList, viewedMissionList]
  );
  const surveys = useCallback((props: RemoteConfigModel.IEarnSection) => <Surveys focusKey={focusKey} key={props.name} {...props} />, [focusKey]);
  const featuredMissions = useCallback(
    (props: RemoteConfigModel.IEarnSection) => (
      <FeaturedMissions focusKey={focusKey} isLoadingCallback={isLoadingCallback => setIsLoadingStreakList(isLoadingCallback)} key={props.name} {...props} />
    ),
    [focusKey]
  );
  const claimYourRewards = useCallback((props: RemoteConfigModel.IEarnSection) => <ClaimYourRewards key={props.name} {...props} />, []);
  const mapCard = useCallback((props: RemoteConfigModel.IEarnSection) => <FindOffersMap key={props.name} {...props} />, []);

  const recentlyViewedMissionsSection = useCallback(
    (props: RemoteConfigModel.IEarnSection) => (
      <RecentlyViewedMissions
        data={recentlyViewedMissions}
        setMissionItemRef={setMissionItemRef}
        itemOnPress={handleNavigateToRecentlyViewedMission}
        viewedMissionList={viewedMissionList}
        onScrollEnd={onScrollEnd}
        missionItemUuidPrefix="recently-viewed-missions"
        listType={KnownMissionSearchKey.DYNAMIC_LIST_3}
        key={props.name}
        {...props}
      />
    ),
    [handleNavigateToRecentlyViewedMission, onScrollEnd, recentlyViewedMissions, setMissionItemRef, viewedMissionList]
  );

  const componentsSections = useMemo(
    () => ({
      [EarnSections.NEW_ON_MAX]: newOnMax,
      [EarnSections.FEATURED_PARTNERS]: featuredPartners,
      [EarnSections.RECENTLY_VIEWED_MISSIONS]: recentlyViewedMissionsSection,
      [EarnSections.ACTIVE_MISSION_OFFERS]: activeMissionsOffers,
      [EarnSections.TOP_CATEGORIES]: topCategories,
      [EarnSections.TOP_BRANDS]: topBrands,
      [EarnSections.SURVEYS]: surveys,
      [EarnSections.FEATURED_MISSIONS]: featuredMissions,
      [EarnSections.CLAIM_YOUR_REWARDS]: claimYourRewards,
      [EarnSections.MAP_CARD]: mapCard
    }),
    [
      activeMissionsOffers,
      claimYourRewards,
      featuredMissions,
      featuredPartners,
      mapCard,
      newOnMax,
      recentlyViewedMissionsSection,
      surveys,
      topBrands,
      topCategories
    ]
  );

  const renderSection = useCallback(
    section => {
      return componentsSections[section.name] ? componentsSections[section.name](section) : null;
    },
    [componentsSections]
  );

  const hasErrors = useMemo(
    () => error || missionCategoryListError || (!isLoadingMissionCategoryList && !categoryList.length) || sectionsError,
    [error, missionCategoryListError, isLoadingMissionCategoryList, categoryList, sectionsError]
  );

  /* istanbul ignore next */
  const handleLayout = ({
    nativeEvent: {
      layout: { height: layoutHeight }
    }
  }: LayoutChangeEvent) => {
    setTopHeight(layoutHeight);
  };

  const tutorialWrapper = useCallback(wrappedChildren => <View style={styles.headerAnimated}>{wrappedChildren}</View>, []);

  if (hasErrors) {
    return <CriticalError />;
  }

  return (
    <View style={styles.container} ref={containerRef}>
      <Animated.View>
        <ConditionalWrapper condition={isTutorialVisible} wrapper={tutorialWrapper}>
          {!isTutorialVisible && (
            <TranslateSearchBarWrapper translateY={searchBarTranslate} handleLayout={handleLayout}>
              <MissionSearchInput ref={searchInputRef} onFocusChange={onFocusChange} hideFilters />
            </TranslateSearchBarWrapper>
          )}
        </ConditionalWrapper>

        {debouncedHideContent ? (
          <EarnMainSkeleton />
        ) : (
          <Tutorial
            refElement={earnMainScrollViewRef}
            topHeight={topHeight}
            stepItems={tutorialItems}
            stepItemParent={parentTutorialItems}
            onTutorialEnd={onTutorialEnd}
            onSkipCallback={handleOnSkipTutorialBanner}
          >
            <Animated.ScrollView
              ref={earnMainScrollViewRef}
              contentContainerStyle={styles.scrollViewContainer}
              onMomentumScrollEnd={onScrollEnd}
              onScrollEndDrag={deps.nativeHelperService.platform.select({ ios: onScrollEnd, default: onScrollEnd })}
              onScrollBeginDrag={onScrollBeginDrag}
              scrollEventThrottle={25}
              {...getTestIdProps('scroll')}
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollYValue } } }], { useNativeDriver: true })}
              contentInsetAdjustmentBehavior="automatic"
            >
              {!isBannerWatched && isTutorialAvailable && <WelcomeTutorialBanner onSkipPress={handleSkipTutorial} onWatchPress={handleShowTutorial} />}
              {showTutorialBanner && <TutorialCongratsBanner fromSkipTutorial={fromSkipTutorial} />}
              {visibleSections.map(section => {
                const { step, moveDown = 0 } = tutorials[section.name] || { step: 0, moveDown: 1 };
                return (
                  <Fragment key={section.name}>
                    {step > 0 ? (
                      <ViewWithTutorial
                        control={updateTutorialItems}
                        step={step}
                        isHidden={step === 1}
                        scrollToDown={Number(scale > 2) * moveDown}
                        setSectionCoordinate={section.name === EarnSections.MAP_CARD && setSectionCoordinate}
                      >
                        {renderSection(section)}
                      </ViewWithTutorial>
                    ) : (
                      renderSection(section)
                    )}
                  </Fragment>
                );
              })}
              <EmptyState
                visible={!missionsTotalCount}
                Icon={RewardsEmptyState}
                title="Seems there’s nothing here"
                subtitleLine1="We couldn't find any offers to show you :("
                subtitleLine2="Come back again later."
              />

              {isTutorialVisible && <View style={{ width, height }} />}
            </Animated.ScrollView>
          </Tutorial>
        )}
      </Animated.View>
      {/* @todo istanbul ignore next was added on [LEAP-3849] - due to failing test */}
      {/* istanbul ignore next */ showCongratsAnimation && <LottieView source={Congrats} resizeMode={'cover'} autoPlay />}
      <TutorialReminderModal />
    </View>
  );
};
export default memo(EarnMain);
